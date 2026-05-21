  <template>
    <div class="donar-container">
      <DonationForm
        v-if="paso === 'formulario'"
        :monto="monto"
        @update:monto="monto = $event"
        :metodoSeleccionado="metodoSeleccionado"
        @update:metodoSeleccionado="metodoSeleccionado = $event"
        :datosTarjeta="datosTarjeta"
        @update:datosTarjeta="datosTarjeta = $event"
        :datosNequi="datosNequi"
        @update:datosNequi="datosNequi = $event"
        :mesActual="mesActual"
        :formularioInvalido="formularioInvalido"
        :cargando="cargando"
        @generarYEnviarCodigo="generarYEnviarCodigo"
        @validarMonto="validarMonto"
      />

      <DonationVerification
        v-else-if="paso === 'verificacion'"
        :codigoIngresado="codigoIngresado"
        @update:codigoIngresado="codigoIngresado = $event"
        @confirmarDonacion="confirmarDonacion"
        @reenviarCodigo="reenviarCodigo"
        :tiempoRestante="tiempoRestante"
      />

      <DonationReceipt
        v-else
        :referencia="referencia"
        :fechaTransaccion="fechaTransaccion"
        :metodoSeleccionado="metodoSeleccionado"
        :monto="monto"
        @reiniciar="reiniciar"
      />
    </div>
  </template>

  <script>
  import DonationForm from '@/components/DonationForm.vue'
  import DonationVerification from '@/components/DonationVerification.vue'
  import DonationReceipt from '@/components/DonationReceipt.vue'
  import api from '@/api'

  export default {
    name: 'DonarView',
    components: {
      DonationForm,
      DonationVerification,
      DonationReceipt
    },
    data() {
      return {
        paso: 'formulario',
        cargando: false,
        monto: 10000,
        metodoSeleccionado: 'credito',
        mesActual: new Date().toISOString().slice(0, 7),
        codigoGenerado: '',
        codigoIngresado: '',
        referencia: '',
        fechaTransaccion: '',
        datosTarjeta: { nombre: '', numero: '', expiracion: '', cvv: '' },
        datosNequi: { celular: '' },
        tiempoRestante: 0,
        timerInterval: null
      }
    },
    computed: {
      formularioInvalido() {
        if (this.metodoSeleccionado === 'nequi') {
          return this.datosNequi.celular.trim().length < 10;
        }

        const d = this.datosTarjeta;
        return !d.nombre.trim() || d.numero.trim().length < 13 || !d.expiracion || d.cvv.trim().length < 3;
      }
    },
    methods: {
      validarMonto() {
        if (this.monto < 10000) {
          this.monto = 10000;
        }
      },
      generarYEnviarCodigo() {
        this.cargando = true;
        this.codigoIngresado = '';
        this.codigoGenerado = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Iniciar temporizador de 60 segundos para reenviar código
        this.tiempoRestante = 60;
        this.iniciarTemporizador();

        setTimeout(() => {
          this.cargando = false;
          this.paso = 'verificacion';
          alert(`NOTIFICACIÓN: Tu código de seguridad para la donación de $${this.monto.toLocaleString()} es: ${this.codigoGenerado}`);
        }, 1200);
      },
      iniciarTemporizador() {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(() => {
          if (this.tiempoRestante > 0) {
            this.tiempoRestante--;
          } else {
            clearInterval(this.timerInterval);
          }
        }, 1000);
      },
      reenviarCodigo() {
        if (this.tiempoRestante === 0) {
          this.codigoGenerado = Math.floor(1000 + Math.random() * 9000).toString();
          this.codigoIngresado = '';
          this.tiempoRestante = 60;
          this.iniciarTemporizador();
          alert(`NOTIFICACIÓN: Tu nuevo código de seguridad es: ${this.codigoGenerado}`);
        }
      },
      async confirmarDonacion() {
        if (this.codigoIngresado === this.codigoGenerado) {
          this.referencia = Math.random().toString(36).substr(2, 9).toUpperCase();
          this.fechaTransaccion = new Date().toLocaleString();

          const nuevaDonacion = {
            referencia: this.referencia,
            monto: this.monto,
            fecha: this.fechaTransaccion,
            metodo: this.metodoSeleccionado,
            tipo: 'donacion'
          };

          const historialExistente = JSON.parse(localStorage.getItem('donaciones_manglares') || '[]');
          historialExistente.unshift(nuevaDonacion);
          localStorage.setItem('donaciones_manglares', JSON.stringify(historialExistente));

          try {
            await api.post('/donations', nuevaDonacion);
          } catch (error) {
            console.warn('Error backend donaciones:', error);
          }

          this.paso = 'factura';
        } else {
          alert('¡Código incorrecto! Revisa la notificación e intenta de nuevo.');
        }
      },
      reiniciar() {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
        }
        this.paso = 'formulario';
        this.codigoIngresado = '';
        this.codigoGenerado = '';
        this.referencia = '';
        this.fechaTransaccion = '';
        this.datosTarjeta = { nombre: '', numero: '', expiracion: '', cvv: '' };
        this.datosNequi = { celular: '' };
        this.monto = 10000;
        this.metodoSeleccionado = 'credito';
        this.tiempoRestante = 0;
      }
    },
    beforeUnmount() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

.donar-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('@/assets/fondo-donar.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed; 
  
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

h1 {
  color: #ffffff; 
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
  text-align: center;
  font-weight: 800;
  font-size: 2.2rem;
  letter-spacing: -0.02em;
  z-index: 1;
}

.donation-box {
  background: rgba(255, 255, 255, 0.92); 
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}

.donar-container::before {
  display: none;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}


input, select {
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 24px;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.25s ease;
  background-color: rgba(255, 255, 255, 0.7);
  box-sizing: border-box;
  color: #1f2937;
}

input:focus, select:focus {
  outline: none;
  border-color: #10b981;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
  transform: translateY(-1px);
}

hr {
  border: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  margin: 10px 0 30px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}


.donar-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 10px;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}

.donar-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.4);
  filter: brightness(1.1);
}

.donar-btn:active:not(:disabled) {
  transform: translateY(0);
}

.donar-btn:disabled {
  background: #d1d5db;
  box-shadow: none;
  cursor: not-allowed;
}


.donar-btn.secondary {
  background: #ffffff;
  color: #374151;
  border: 1.5px solid #e5e7eb;
  box-shadow: none;
}

.donar-btn.secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}


.otp-input {
  text-align: center;
  font-size: 2rem;
  letter-spacing: 15px;
  font-weight: 800;
  color: #059669;
  border-width: 2px;
  background: #f0fdf4;
}


.receipt {
  text-align: center;
}

.success-icon {
  font-size: 60px;
  margin-bottom: 20px;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.factura-detalles {
  background: rgba(249, 250, 251, 0.8);
  border-radius: 20px;
  padding: 24px;
  text-align: left;
  margin: 25px 0;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.factura-detalles p {
  margin: 12px 0;
  font-size: 0.95rem;
  color: #4b5563;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  padding-bottom: 8px;
}

.factura-detalles p:last-child {
  border-bottom: none;
  font-size: 1.1rem;
  margin-top: 15px;
}

.factura-detalles strong {
  color: #111827;
}

.info-text {
  font-size: 0.85rem;
  color: #6b7280;
  transition: color 0.2s;
}

.info-text:hover {
  color: #059669;
}
</style>