<template>
  <transition name="fade">
    <section class="admin-panel">
      <div class="admin-overlay" @click="$emit('close')"></div>
      
      <div class="admin-card animate-pop">
        <div class="admin-header">
          <div class="header-content">
            <div class="icon-badge">
              <i class="fas fa-leaf"></i>
            </div>
            <div>
              <h2>Panel de Control</h2>
              <p>Gestión de ecosistemas y comunidad EcoManglar</p>
            </div>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <span class="close-icon">×</span>
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-item highlight">
            <div class="stat-info">
              <span class="stat-label">Recaudación Total</span>
              <p class="money">${{ totalSincronizado.toLocaleString() }}</p>
            </div>
            <div class="progress-container">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" :style="{ width: porcentajeReal + '%' }"></div>
              </div>
              <div class="progress-meta">
                <small>Meta: 10M COP</small>
                <small class="percent-text">{{ porcentajeReal }}%</small>
              </div>
            </div>
          </div>

          <div class="stat-item glass">
            <span class="stat-label">Participación Social</span>
            <p class="stat-number">{{ listaVoluntarios.length }}</p>
            <small class="stat-sub">Voluntarios Activos</small>
          </div>
        </div>

        <div class="admin-tools">
          <div class="admin-tabs">
            <button :class="{ active: tab === 'donaciones' }" @click="$emit('update:tab', 'donaciones')">
              Donaciones
            </button>
            <button :class="{ active: tab === 'voluntarios' }" @click="$emit('update:tab', 'voluntarios')">
              Voluntarios
            </button>
          </div>
          
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              type="text"
              :value="busqueda"
              @input="$emit('update:busqueda', $event.target.value)"
              placeholder="Filtrar registros..."
              class="search-input"
            >
          </div>

          <div class="action-btns">
            <button @click="$emit('exportCSV')" class="tool-btn csv">
              <span>📥</span> Exportar
            </button>
            <button
              v-if="tab === 'donaciones'"
              @click="deleteSelectedTransfer"
              class="tool-btn delete"
              :disabled="selectedDonationIndex === null"
            >
              <span>🗑️</span>
              Eliminar registro
            </button>
            <button
              @click="handleAction"
              :class="['tool-btn', tab === 'donaciones' ? 'withdraw' : 'delete']"
              :disabled="tab === 'voluntarios' && selectedVolunteerIndex === null"
            >
              <span v-if="tab === 'donaciones'">💰</span>
              <span v-else>🗑️</span>
              {{ tab === 'donaciones' ? (showWithdrawForm ? 'Cerrar formulario' : 'Retirar Dinero') : 'Eliminar Voluntario' }}
            </button>
          </div>
          <div v-if="tab === 'donaciones' && selectedDonationIndex !== null" class="selected-note">
            Registro seleccionado: #{{ donacionesFiltradas[selectedDonationIndex]?.referencia }}
          </div>
          <form v-if="tab === 'donaciones' && showWithdrawForm" class="withdraw-form" @submit.prevent="submitWithdraw">
            <div class="form-row">
              <label>Monto a retirar</label>
              <input
                type="text"
                v-model="formattedWithdrawAmount"
                placeholder="Ingresa el monto a retirar"
              />
              <small>Saldo disponible: ${{ totalSincronizado.toLocaleString() }} COP</small>
            </div>
            <div class="form-row">
              <label>Método de pago</label>
              <select v-model="withdrawMethod">
                <option value="nequi">NEQUI</option>
                <option value="tarjeta">TARJETA</option>
              </select>
            </div>
            <div class="form-row">
              <label>{{ withdrawMethod === 'nequi' ? 'Número NEQUI' : 'Número de tarjeta' }}</label>
              <input
                type="text"
                v-model="formattedWithdrawData"
                :placeholder="withdrawMethod === 'nequi' ? '3001234567' : '1234-5678-9012-3456'"
              />
              <small>{{ withdrawMethod === 'nequi' ? 'NEQUI debe tener 10 dígitos.' : 'Tarjeta debe tener 16 dígitos.' }}</small>
            </div>
            <div class="form-actions">
              <button type="submit" class="tool-btn withdraw">Confirmar Retiro</button>
              <button type="button" @click="cancelWithdraw" class="tool-btn delete">Cancelar</button>
            </div>
          </form>
          <p v-if="tab === 'voluntarios'" class="selection-note">
            {{ selectedVolunteerIndex !== null ? `Voluntario seleccionado: ${voluntariosFilrados[selectedVolunteerIndex].nombre}` : 'Haz clic en un voluntario para eliminarlo.' }}
          </p>
        </div>

        <div class="table-container">
          <table v-if="!sinResultados">
            <thead>
              <tr v-if="tab === 'donaciones'">
                <th>Referencia</th>
                <th>Monto</th>
                <th>Detalle</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
              <tr v-else>
                <th>Nombre</th>
                <th>Habilidad / Contacto</th>
                <th>Registro</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody :key="tab">
              <template v-if="tab === 'donaciones'">
                <tr
                  v-for="(d, i) in donacionesFiltradas"
                  :key="d.referencia"
                  :class="[
                    'table-row',
                    { 'withdraw-row': d.tipo === 'retiro', 'donation-row': d.tipo !== 'retiro', 'selected-row': selectedDonationIndex === i }
                  ]"
                  @click="selectDonation(i)"
                >
                  <td class="ref-text">#{{ d.referencia }}</td>
                  <td class="amt-text">
                    <span :class="d.tipo === 'retiro' ? 'amount-negative' : 'amount-positive'">
                      {{ d.tipo === 'retiro' ? '-' : '' }}${{ Math.abs(Number(d.monto)).toLocaleString() }}
                    </span>
                  </td>
                  <td class="detail-text">
                    {{ d.tipo === 'retiro' ? `Retiro ${d.metodo?.toUpperCase() || ''} ${d.paymentInfo ? '(' + d.paymentInfo + ')' : ''}` : `Donación ${d.metodo ? '(' + d.metodo + ')' : ''}` }}
                  </td>
                  <td class="date-text">{{ d.fecha }}</td>
                  <td>
                    <span :class="['status-tag', d.tipo === 'retiro' ? 'danger' : 'success']">
                      {{ d.tipo === 'retiro' ? 'Retiro' : 'Donación' }}
                    </span>
                  </td>
                </tr>
              </template>

              <template v-else>
                <tr
                  v-for="(v, i) in voluntariosFilrados"
                  :key="i"
                  :class="['table-row', { 'selected-row': selectedVolunteerIndex === i }]"
                  @click="selectedVolunteerIndex = i"
                >
                  <td class="user-text"><strong>{{ v.nombre }}</strong></td>
                  <td class="detail-text">
                    {{ v.habilidad }} <br> 
                    <span class="email-sub">{{ v.correo }}</span>
                  </td>
                  <td class="date-text">{{ v.fecha }}</td>
                  <td><span class="status-tag info">Inscrito</span></td>
                </tr>
              </template>
            </tbody>
          </table>
          <div v-else class="no-results-premium">
            <p>No se encontraron registros para tu búsqueda.</p>
          </div>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  name: 'AdminPanel',
  props: {
    tab: { type: String, default: 'donaciones' },
    busqueda: { type: String, default: '' },
    listaDonaciones: { type: Array, default: () => [] },
    listaVoluntarios: { type: Array, default: () => [] },
    metaObjetivo: { type: Number, default: 10000000 } // 10M COP por defecto
  },
  data() {
    return {
      selectedVolunteerIndex: null,
      selectedDonationIndex: null,
      showWithdrawForm: false,
      withdrawAmount: '',
      withdrawMethod: 'nequi',
      withdrawData: ''
    }
  },
  emits: ['update:tab', 'update:busqueda', 'close', 'exportCSV', 'realizarRetiro', 'eliminarVoluntario', 'eliminarTransaccion'],
  computed: {
    formattedWithdrawAmount: {
      get() {
        return this.withdrawAmount ? Number(this.withdrawAmount).toLocaleString('en-US') : '';
      },
      set(value) {
        const digits = String(value).replace(/\D/g, '');
        this.withdrawAmount = digits ? String(Number(digits)) : '';
      }
    },
    formattedWithdrawData: {
      get() {
        if (!this.withdrawData) return '';
        const digits = this.withdrawData.replace(/\D/g, '');
        if (this.withdrawMethod === 'tarjeta') {
          return digits.replace(/(.{4})/g, '$1-').replace(/-$/, '');
        }
        return digits;
      },
      set(value) {
        const digits = String(value).replace(/\D/g, '');
        const maxLength = this.withdrawMethod === 'nequi' ? 10 : 16;
        this.withdrawData = digits.slice(0, maxLength);
      }
    },
    totalSincronizado() {
      const lista = this.listaDonaciones.length
        ? this.listaDonaciones
        : JSON.parse(localStorage.getItem('donaciones_manglares') || '[]');
      return lista.reduce((acc, item) => acc + Number(item.monto), 0);
    },
    porcentajeReal() {
      const perc = (this.totalSincronizado / this.metaObjetivo) * 100;
      return Math.min(Math.max(Math.round(perc), 0), 100);
    },
    donacionesFiltradas() {
      const lista = this.listaDonaciones.length
        ? this.listaDonaciones
        : JSON.parse(localStorage.getItem('donaciones_manglares') || '[]');
      return lista
        .filter(d => d.visible !== false)
        .filter(d =>
          d.referencia?.toLowerCase().includes(this.busqueda.toLowerCase())
        );
    },
    voluntariosFilrados() {
      const lista = this.listaVoluntarios || [];
      return lista.filter(v =>
        v.nombre?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        v.habilidad?.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    },
    sinResultados() {
      return this.tab === 'donaciones' 
        ? this.donacionesFiltradas.length === 0 
        : this.voluntariosFilrados.length === 0;
    }
  },
  watch: {
    tab() {
      this.selectedVolunteerIndex = null;
      this.selectedDonationIndex = null;
      this.showWithdrawForm = false;
    },
    listaDonaciones() {
      this.selectedDonationIndex = null;
    },
    busqueda() {
      this.selectedDonationIndex = null;
    },
    withdrawMethod(newMethod) {
      const maxLength = newMethod === 'nequi' ? 10 : 16;
      this.withdrawData = this.withdrawData.slice(0, maxLength);
    }
  },
  methods: {
    handleAction() {
      if (this.tab === 'donaciones') {
        this.showWithdrawForm = !this.showWithdrawForm;
        return;
      }

      if (this.selectedVolunteerIndex === null) {
        return;
      }

      const volunteer = this.voluntariosFilrados[this.selectedVolunteerIndex];
      this.$emit('eliminarVoluntario', volunteer);
      this.selectedVolunteerIndex = null;
    },
    submitWithdraw() {
      const monto = Number(this.withdrawAmount);
      if (!monto || monto <= 0 || monto > this.totalSincronizado) {
        return alert('Ingresa un monto válido menor o igual al saldo disponible.');
      }

      const paymentInfo = this.withdrawData.trim();
      if (!paymentInfo) {
        return alert('Ingresa los datos de pago requeridos.');
      }

      if (this.withdrawMethod === 'nequi' && paymentInfo.length !== 10) {
        return alert('Ingresa un número NEQUI válido de 10 dígitos.');
      }

      if (this.withdrawMethod === 'tarjeta' && paymentInfo.length !== 16) {
        return alert('Ingresa un número de tarjeta válido de 16 dígitos.');
      }

      const payload = {
        amount: monto,
        method: this.withdrawMethod,
        paymentInfo
      };
      this.$emit('realizarRetiro', payload);
      this.showWithdrawForm = false;
      this.withdrawAmount = '';
      this.withdrawData = '';
    },
    selectDonation(index) {
      this.selectedDonationIndex = index;
      this.selectedVolunteerIndex = null;
    },
    deleteSelectedTransfer() {
      if (this.selectedDonationIndex === null) return;
      const seleccion = this.donacionesFiltradas[this.selectedDonationIndex];
      if (!seleccion) return;
      const confirmDelete = confirm(`¿Eliminar del historial la transferencia ${seleccion.referencia}? El dinero no se verá afectado.`);
      if (!confirmDelete) return;
      this.$emit('eliminarTransaccion', seleccion);
      this.selectedDonationIndex = null;
    },
    cancelWithdraw() {
      this.showWithdrawForm = false;
      this.withdrawAmount = '';
      this.withdrawData = '';
    }
  }
} 
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

.admin-panel {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 9999;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 20px;
}

.admin-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 8, 5, 0.85);
  backdrop-filter: blur(10px);
}

.admin-card {
  position: relative;
  width: 100%;
  max-width: 1000px;
  background: rgba(20, 25, 23, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow-y: auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  gap: 15px;
  align-items: center;
}

.icon-badge {
  background: #1f6f2a;
  color: #e8f544;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.2rem;
}

.premium-tag {
  font-size: 0.6rem;
  background: #e8f544;
  color: #000;
  padding: 2px 6px;
  border-radius: 4px;
  vertical-align: middle;
  margin-left: 5px;
}

h2 {
  font-size: 1.6rem;
  color: #fff;
  font-weight: 800;
  margin: 0;
}

.admin-header p {
  color: #a0aec0;
  font-size: 0.95rem;
  margin-top: 4px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #ff4d4d;
  border-color: #ff4d4d;
}

.stats-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.stat-item.highlight {
  background: linear-gradient(135deg, #1f6f2a 0%, #0d2e12 100%);
  border: 1px solid rgba(232, 245, 68, 0.2);
}

.stat-item.glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-label {
  color: #d1d5db;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.money {
  font-size: 2.2rem;
  font-weight: 800;
  color: #e8f544;
  margin: 10px 0;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin: 10px 0;
}

.progress-bar-bg {
  background: rgba(0, 0, 0, 0.3);
  height: 10px;
  border-radius: 10px;
  margin-top: 15px;
}

.progress-bar-fill {
  background: #e8f544;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(232, 245, 68, 0.4);
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: #fff;
  font-weight: 600;
}

.admin-tools {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.02);
  padding: 10px;
  border-radius: 16px;
}

.admin-tabs {
  display: flex;
  background: #000;
  padding: 5px;
  border-radius: 12px;
}

.admin-tabs button {
  padding: 8px 18px;
  border-radius: 9px;
  border: none;
  background: transparent;
  color: #718096;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-tabs button.active {
  background: #1f6f2a;
  color: #fff;
}

.search-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 12px;
  color: #fff;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #e8f544;
  background: rgba(255, 255, 255, 0.08);
}

.tool-btn {
  padding: 10px 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tool-btn.withdraw {
  background: linear-gradient(135deg, #8bc34a, #e8f544);
  color: #06110a;
  border-color: transparent;
}

.tool-btn.withdraw:hover {
  background: linear-gradient(135deg, #a5d869, #f8f34a);
}

  .tool-btn.delete:hover {
  background: rgba(255, 77, 77, 0.15);
  color: #ff4d4d;
  border-color: #ff4d4d;
}

  .withdraw-form {
    margin-top: 18px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    display: grid;
    gap: 14px;
  }

  .withdraw-form .form-row {
    display: grid;
    gap: 8px;
  }

  .withdraw-form label {
    color: #cbd5e1;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .withdraw-form input,
  .withdraw-form select {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    font-size: 0.95rem;
  }

  .withdraw-form input::placeholder {
    color: rgba(255, 255, 255, 0.55);
  }

  .withdraw-form small {
    color: #94a3b8;
  }

  .withdraw-form .form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

thead th {
  text-align: left;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.03);
  color: #718096;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

tbody td {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
  font-size: 0.95rem;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.selected-row {
  background: rgba(232, 245, 68, 0.16);
}

.tool-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.amt-text {
  font-weight: 800;
  color: #e8f544;
}

.amount-positive {
  color: #4ade80;
}

.amount-negative {
  color: #f87171;
}

.withdraw-row {
  background: rgba(248, 113, 113, 0.06);
}

.ref-text {
  font-family: monospace;
  color: #718096;
}

.email-sub {
  font-size: 0.8rem;
  color: #718096;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-tag.success {
  background: rgba(31, 111, 42, 0.2);
  color: #4ade80;
}

.status-tag.danger {
  background: rgba(248, 113, 113, 0.18);
  color: #f87171;
}

.status-tag.info {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-pop {
  animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
  from { transform: scale(0.9) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.admin-card::-webkit-scrollbar { width: 6px; }
.admin-card::-webkit-scrollbar-track { background: transparent; }
.admin-card::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>