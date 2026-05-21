<template>
  <div class="donation-box premium">
    <div class="premium-header">
      <div class="icon-circle">
        <span class="leaf-icon">🌿</span>
      </div>
      <h1>Apoya la protección de manglares</h1>
      <p class="info-text">Selecciona tu método de donación y completa los datos.</p>
    </div>

    <div class="input-group">
      <label>
        <span class="label-icon"></span> Monto (COP)
      </label>
      <div class="input-premium">
        <span class="currency-symbol">$</span>
        <input
          type="number"
          :value="monto"
          min="10000"
          @input="$emit('update:monto', Number($event.target.value))"
          @blur="$emit('validarMonto')"
          placeholder="10,000"
        />
      </div>
      <div class="quick-amounts">
        <button v-for="amount in [10000, 25000, 50000, 100000]" :key="amount" 
          :class="{ active: monto === amount }"
          @click="$emit('update:monto', amount)">
          ${{ amount.toLocaleString() }}
        </button>
      </div>
    </div>

    <div class="input-group">
      <label>
        <span class="label-icon"></span> Método de pago
      </label>
      <div class="payment-methods">
        <button 
          :class="['method-btn', { active: metodoSeleccionado === 'credito' }]"
          @click="$emit('update:metodoSeleccionado', 'credito')">
          <span class="method-icon"></span>
          <span>Tarjeta de crédito</span>
        </button>
        <button 
          :class="['method-btn', { active: metodoSeleccionado === 'nequi' }]"
          @click="$emit('update:metodoSeleccionado', 'nequi')">
          <span class="method-icon"></span>
          <span>Nequi</span>
        </button>
      </div>
    </div>

    <div v-if="metodoSeleccionado === 'credito'" class="card-form">
      <div class="input-group">
        <label>
          <span class="label"></span> Nombre en la tarjeta
        </label>
        <input
          type="text"
          :value="datosTarjeta.nombre"
          @input="$emit('update:datosTarjeta', { ...datosTarjeta, nombre: $event.target.value })"
          placeholder="Nombre completo"
          class="premium-input"
        />
      </div>

      <div class="input-group">
        <label>
          <span class="label"></span> Número de tarjeta
        </label>
        <input
          type="text"
          :value="datosTarjeta.numero"
          @input="$emit('update:datosTarjeta', { ...datosTarjeta, numero: $event.target.value })"
          placeholder="1234 5678 9012 3456"
          maxlength="19"
          class="premium-input"
        />
      </div>

      <div class="row">
        <div class="input-group">
          <label>
            <span class="label"></span> Expiración
          </label>
          <input
            type="month"
            :value="datosTarjeta.expiracion"
            @input="$emit('update:datosTarjeta', { ...datosTarjeta, expiracion: $event.target.value })"
            class="premium-input"
          />
        </div>
        <div class="input-group">
          <label>
            <span class="label"></span> CVV
          </label>
          <input
            type="text"
            :value="datosTarjeta.cvv"
            @input="$emit('update:datosTarjeta', { ...datosTarjeta, cvv: $event.target.value })"
            placeholder="***"
            maxlength="4"
            class="premium-input"
          />
        </div>
      </div>
    </div>

    <div v-else class="nequi-form">
      <div class="input-group">
        <label>
          <span class="label"></span> Celular Nequi
        </label>
        <input
          type="tel"
          :value="datosNequi.celular"
          @input="$emit('update:datosNequi', { ...datosNequi, celular: $event.target.value })"
          placeholder="300 123 4567"
          class="premium-input"
        />
      </div>
    </div>

    <button class="donar-btn premium-btn" :disabled="formularioInvalido || cargando" @click="$emit('generarYEnviarCodigo')">
      <span v-if="cargando" class="loading-spinner"></span>
      <span v-else> Continuar con la donación</span>
      <span class="btn-amount">${{ monto.toLocaleString() }}</span>
    </button>

    <div class="impact-panel">
      <p><strong>Impacto estimado:</strong> cada $10.000 COP contribuye a restaurar manglares y cuidar cuencas hídricas.</p>
    </div>
    
    <p class="secure-notice">
      <span>🔒</span> Tus datos están protegidos y la transacción es 100% segura.
    </p>
  </div>
</template>

<script>
export default {
  name: 'DonationForm',
  props: {
    monto: { type: Number, required: true },
    metodoSeleccionado: { type: String, required: true },
    datosTarjeta: { type: Object, required: true },
    datosNequi: { type: Object, required: true },
    formularioInvalido: { type: Boolean, required: true },
    cargando: { type: Boolean, required: true }
  },
  watch: {
    'datosNequi.celular'(newVal) {
      if (newVal.length > 10) {
        this.$emit('update:datosNequi', { ...this.datosNequi, celular: newVal.slice(0, 10) });
      }
    },
    'datosTarjeta.numero'(newVal) {
      if (newVal.length > 16) {
        this.$emit('update:datosTarjeta', { ...this.datosTarjeta, numero: newVal.slice(0, 16) });
      }
    }
  }
}
</script>


<style scoped>
.donation-box.premium {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.premium-header {
  text-align: center;
  margin-bottom: 30px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
}

.leaf-icon {
  font-size: 2.5rem;
}

.premium-header h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.premium-header .info-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.donation-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 16px;
  color: #fff;
  text-align: center;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.metric-card strong {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #f8fcf2;
}

.metric-card span {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.82rem;
  line-height: 1.4;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.label-icon {
  font-size: 1rem;
}

.input-premium {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 18px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  font-weight: 600;
}

.premium-input,
.input-premium input {
  width: 100%;
  padding: 16px 18px;
  padding-left: 35px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.premium-input:focus,
.input-premium input:focus {
  outline: none;
  border-color: #4caf50;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15);
}

.premium-input::placeholder,
.input-premium input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.quick-amounts {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.quick-amounts button {
  flex: 1;
  min-width: 80px;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-amounts button:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.4);
}

.quick-amounts button.active {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  border-color: #4caf50;
  color: #fff;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.payment-methods {
  display: flex;
  gap: 12px;
}

.method-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.method-btn.active {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(46, 125, 50, 0.3) 100%);
  border-color: #4caf50;
  color: #fff;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.2);
}

.method-icon {
  font-size: 1.3rem;
}

.card-form,
.nequi-form {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.donar-btn.premium-btn {
  width: 100%;
  padding: 18px 30px;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  border: none;
  border-radius: 16px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
  position: relative;
  overflow: hidden;
}

.donar-btn.premium-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.donar-btn.premium-btn:hover::before {
  left: 100%;
}

.donar-btn.premium-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.5);
}

.donar-btn.premium-btn:disabled {
  background: linear-gradient(135deg, #666 0%, #444 100%);
  cursor: not-allowed;
  box-shadow: none;
}

.btn-amount {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.impact-panel {
  margin-top: 18px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;
}

.loading-spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.secure-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

.secure-notice span {
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .donation-box.premium {
    padding: 25px;
  }
  
  .payment-methods {
    flex-direction: column;
  }
  
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
