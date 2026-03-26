  <template>
    <div class="donar-container">
      <h1>Apoya la protección de manglares</h1>
      
      <div v-if="paso === 'formulario'" class="donation-box">
        <label>Monto de donación (Mínimo $10,000)</label>
        <input type="number" v-model.number="monto" @blur="validarMonto">

        <label>Método de pago</label>
        <select v-model="metodoSeleccionado">
          <option value="credito">Tarjeta de Crédito</option>
          <option value="debito">Tarjeta de Débito</option>
          <option value="nequi">Nequi</option>
        </select>

        <hr />

        <div v-if="metodoSeleccionado !== 'nequi'">
          <label>Nombre en tarjeta</label>
          <input type="text" v-model="datosTarjeta.nombre" placeholder="Nombre completo">
          <label>Número de tarjeta</label>
          <input type="text" v-model="datosTarjeta.numero" placeholder="XXXX XXXX XXXX XXXX" maxlength="19">
          <div class="row">
            <div>
              <label>Expiración</label>
              <input type="month" v-model="datosTarjeta.expiracion" :min="mesActual">
            </div>
            <div>
              <label>CVV</label>
              <input type="password" v-model="datosTarjeta.cvv" maxlength="3" placeholder="123">
            </div>
          </div>
        </div>

        <div v-else>
          <label>Número de celular (Nequi)</label>
          <input type="tel" v-model="datosNequi.celular" placeholder="300 123 4567" maxlength="10">
        </div>

        <button class="donar-btn" @click="generarYEnviarCodigo" :disabled="formularioInvalido || cargando">
          {{ cargando ? 'Procesando...' : 'Donar $' + monto.toLocaleString() }}
        </button>
      </div>

      <div v-if="paso === 'verificacion'" class="donation-box">
        <h2>Verifica tu transacción</h2>
        <p>Ingresa el código de 4 dígitos que recibiste.</p>
        <input 
          type="text" 
          v-model="codigoIngresado" 
          placeholder="0000" 
          maxlength="4" 
          class="otp-input"
        >
        <button class="donar-btn" @click="confirmarDonacion" :disabled="codigoIngresado.length < 4">
          Validar Código
        </button>
        <p class="info-text" @click="generarYEnviarCodigo" style="cursor:pointer; text-decoration:underline; margin-top:15px;">
          No recibí el código, enviar otro.
        </p>
      </div>

      <div v-if="paso === 'factura'" class="donation-box receipt">
        <div class="success-icon">🌿</div>
        <h2>Donación Confirmada</h2>
        <p>¡Gracias por proteger los manglares!</p>
        
        <div class="factura-detalles">
          <p><strong>Referencia:</strong> #{{ referencia }}</p>
          <p><strong>Fecha:</strong> {{ fechaTransaccion }}</p>
          <p><strong>Método:</strong> {{ metodoSeleccionado.toUpperCase() }}</p>
          <p><strong>Total Pagado:</strong> ${{ monto.toLocaleString() }}</p>
          <p style="font-size: 10px; color: #888; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 5px;">
            Esta es una factura digital válida para soporte de pago.
          </p>
        </div>
        
        <button class="donar-btn secondary" @click="reiniciar">Nueva Donación</button>
      </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        paso: 'formulario',
        cargando: false,
        monto: 10000,
        metodoSeleccionado: "credito",
        mesActual: new Date().toISOString().slice(0, 7),
        codigoGenerado: null, 
        codigoIngresado: "",
        referencia: "",
        fechaTransaccion: "",
        datosTarjeta: { nombre: "", numero: "", expiracion: "", cvv: "" },
        datosNequi: { celular: "" }
      }
    },
    computed: {
      formularioInvalido() {
        if (this.metodoSeleccionado === 'nequi') return this.datosNequi.celular.length < 10;
        const d = this.datosTarjeta;
        return !d.nombre || d.numero.length < 13 || !d.expiracion || d.cvv.length < 3;
      }
    },
    methods: {
      validarMonto() {
        if (this.monto < 10000) this.monto = 10000;
      },
      generarYEnviarCodigo() {
        this.cargando = true;
        this.codigoIngresado = ""; 
        
        this.codigoGenerado = Math.floor(1000 + Math.random() * 9000).toString();

        setTimeout(() => {
          this.cargando = false;
          this.paso = 'verificacion';
          
          alert(`NOTIFICACIÓN: Tu código de seguridad para la donación de $${this.monto.toLocaleString()} es: ${this.codigoGenerado}`);
        }, 1200);
      },
      confirmarDonacion() {
  if (this.codigoIngresado === this.codigoGenerado) {
    // 1. Generar datos de la transacción
    this.referencia = Math.random().toString(36).substr(2, 9).toUpperCase();
    this.fechaTransaccion = new Date().toLocaleString();

    // 2. Crear el objeto de la nueva donación
    const nuevaDonacion = {
      referencia: this.referencia,
      monto: this.monto,
      fecha: this.fechaTransaccion,
      metodo: this.metodoSeleccionado
    };

    // 3. Persistencia en LocalStorage para que el Admin lo vea
    // Primero traemos lo que ya existe o creamos un array vacío si es la primera vez
    const historialExistente = JSON.parse(localStorage.getItem('donaciones_manglares') || '[]');
    
    // Agregamos la nueva al principio de la lista
    historialExistente.unshift(nuevaDonacion);
    
    // Guardamos de nuevo en el LocalStorage
    localStorage.setItem('donaciones_manglares', JSON.stringify(historialExistente));

    // 4. Cambiar a la vista de factura
    this.paso = 'factura';
  } else {
    alert("¡Código incorrecto! Revisa la notificación e intenta de nuevo.");
  }
},
      reiniciar() {
        this.paso = 'formulario';
        this.codigoIngresado = "";
        this.codigoGenerado = null;
        this.datosTarjeta = { nombre: "", numero: "", expiracion: "", cvv: "" };
        this.datosNequi = { celular: "" };
      }
    }
  }
  </script>

<style scoped>
/* Importamos una fuente más elegante */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

.donar-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Fondo con degradado profundo y orgánico */
  background: radial-gradient(circle at top left, #e8f5e9, #c8e6c9, #a5d6a7);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Decoración abstracta de fondo para el toque premium */
.donar-container::before {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  top: -100px;
  right: -50px;
  filter: blur(80px);
}

h1 {
  color: #064e3b;
  margin-bottom: 40px;
  text-align: center;
  font-weight: 800;
  font-size: 2rem;
  letter-spacing: -0.02em;
}

/* Caja de Donación con Efecto Cristal */
.donation-box {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  padding: 40px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 20px 40px -10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
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

/* Inputs con diseño minimalista */
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

/* Botón Ultra Premium */
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

/* Estilo para Nequi o detalles secundarios */
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

/* Vista OTP con espaciado elegante */
.otp-input {
  text-align: center;
  font-size: 2rem;
  letter-spacing: 15px;
  font-weight: 800;
  color: #059669;
  border-width: 2px;
  background: #f0fdf4;
}

/* Recibo de Factura Premium */
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