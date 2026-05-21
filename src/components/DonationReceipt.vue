<template>
  <div class="donation-box premium">
    <div class="receipt">
      <div class="success-animation">
        <div class="checkmark-circle">
          <span class="checkmark">✓</span>
        </div>
      </div>
      <h2>¡Donación exitosa! </h2>
      <p class="info-text">Gracias por proteger el ecosistema de manglares en Santa Marta.</p>
    </div>

    <div class="factura-detalles">
      <div class="detail-card">
        <div class="detail-icon">📋</div>
        <div class="detail-content">
          <span class="detail-label">Referencia</span>
          <span class="detail-value">#{{ referencia }}</span>
        </div>
      </div>
      
      <div class="detail-card">
        <div class="detail-icon">💵</div>
        <div class="detail-content">
          <span class="detail-label">Monto donado</span>
          <span class="detail-value highlight">${{ monto.toLocaleString() }} COP</span>
        </div>
      </div>
      
      <div class="detail-card">
        <div class="detail-icon">💳</div>
        <div class="detail-content">
          <span class="detail-label">Método de pago</span>
          <span class="detail-value">{{ metodoSeleccionado === 'credito' ? 'Tarjeta de crédito' : 'Nequi' }}</span>
        </div>
      </div>
      
      <div class="detail-card">
        <div class="detail-icon">📅</div>
        <div class="detail-content">
          <span class="detail-label">Fecha</span>
          <span class="detail-value">{{ fechaTransaccion }}</span>
        </div>
      </div>
    </div>

    <div class="impact-message">
      <span class="impact-icon"></span>
      <p>Tu contribución ayuda a plantar árboles y proteger la biodiversidad marina.</p>
    </div>

    <button class="donar-btn premium-btn" @click="$emit('reiniciar')">
      <span></span> Realizar otra donación
    </button>
  </div>
</template>

<script>
export default {
  name: 'DonationReceipt',
  props: {
    referencia: { type: String, required: true },
    fechaTransaccion: { type: String, required: true },
    metodoSeleccionado: { type: String, required: true },
    monto: { type: Number, required: true }
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

.receipt {
  text-align: center;
  margin-bottom: 30px;
}

.success-animation {
  margin-bottom: 20px;
}

.checkmark-circle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.checkmark {
  font-size: 3rem;
  color: #000000;
}

.receipt h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #000000;
  margin-bottom: 10px;
}

.receipt .info-text {
  color: rgba(0, 0, 0, 0.7);
  font-size: 1rem;
}

.factura-detalles {
  display: grid;
  gap: 15px;
  margin-bottom: 25px;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.detail-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(5px);
}

.detail-icon {
  font-size: 1.5rem;
  width: 45px;
  height: 45px;
  background: rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.85rem;
}

.detail-value {
  color: #000000;
  font-size: 1rem;
  font-weight: 700;
}

.detail-value.highlight {
  color: #4caf50;
  font-size: 1.2rem;
}

.impact-message {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(46, 125, 50, 0.2) 100%);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.impact-icon {
  font-size: 2rem;
}

.impact-message p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
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
  gap: 10px;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
}

.donar-btn.premium-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.5);
}

@media (max-width: 480px) {
  .donation-box.premium {
    padding: 25px;
  }
  
  .detail-card {
    padding: 12px 15px;
  }
  
  .impact-message {
    flex-direction: column;
    text-align: center;
  }
}
</style>
