<template>
  <div class="donation-box premium">
    <div class="premium-header">
      <div class="icon-circle">
        <span class="lock-icon">🔐</span>
      </div>
      <h1>Verificación de seguridad</h1>
      <p class="info-text">Ingresa el código de 4 dígitos que recibiste para completar tu aporte.</p>
    </div>

    <div class="otp-container">
      <input
        v-for="(digit, index) in 4"
        :key="index"
        class="otp-digit"
        type="text"
        maxlength="1"
        :value="codigoIngresado[index] || ''"
        @input="handleInput($event, index)"
        @keydown="handleKeydown($event, index)"
        @paste="handlePaste"
        :ref="el => otpInputs[index] = el"
      />
    </div>

    <div class="resend-section">
      <p v-if="tiempoRestante > 0" class="timer">
        <span>⏱️</span> Reenviar código en {{ tiempoRestante }}s
      </p>
      <button v-else class="resend-btn" @click="$emit('reenviarCodigo')">
        <span>📨</span> ¿No recibiste el código? Reenviar
      </button>
    </div>

    <button class="donar-btn premium-btn" :disabled="codigoIngresado.length !== 4" @click="$emit('confirmarDonacion')">
      <span>✨</span> Confirmar donación
    </button>

    <p class="secure-notice">
      <span>🔒</span> Verificación requerida para tu seguridad
    </p>
  </div>
</template>

<script>
export default {
  name: 'DonationVerification',
  props: {
    codigoIngresado: { type: String, required: true },
    tiempoRestante: { type: Number, default: 0 }
  },
  emits: ['update:codigoIngresado', 'confirmarDonacion', 'reenviarCodigo'],
  data() {
    return {
      otpInputs: []
    }
  },
  methods: {
    handleInput(event, index) {
      const value = event.target.value;
      if (/^\d*$/.test(value)) {
        const newCode = this.codigoIngresado.split('');
        newCode[index] = value;
        this.$emit('update:codigoIngresado', newCode.join(''));
        
        if (value && index < 3) {
          this.$nextTick(() => {
            this.otpInputs[index + 1]?.focus();
          });
        }
      }
    },
    handleKeydown(event, index) {
      if (event.key === 'Backspace' && !this.codigoIngresado[index] && index > 0) {
        this.otpInputs[index - 1]?.focus();
      }
    },
    handlePaste(event) {
      event.preventDefault();
      const pasteData = event.clipboardData.getData('text').slice(0, 4);
      if (/^\d+$/.test(pasteData)) {
        this.$emit('update:codigoIngresado', pasteData);
        this.$nextTick(() => {
          this.otpInputs[Math.min(pasteData.length, 3)]?.focus();
        });
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
  max-width: 450px;
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
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 30px rgba(255, 152, 0, 0.4);
}

.lock-icon {
  font-size: 2.5rem;
}

.premium-header h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}

.premium-header .info-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
}

.otp-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 30px 0;
}

.otp-digit {
  width: 60px;
  height: 70px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 800;
  text-align: center;
  transition: all 0.3s ease;
}

.otp-digit:focus {
  outline: none;
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.15);
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
  transform: scale(1.05);
}

.otp-digit::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.resend-section {
  text-align: center;
  margin-bottom: 25px;
}

.timer {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.resend-btn {
  background: none;
  border: none;
  color: #4caf50;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
  padding: 10px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.resend-btn:hover {
  background: rgba(76, 175, 80, 0.15);
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

.donar-btn.premium-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.5);
}

.donar-btn.premium-btn:disabled {
  background: linear-gradient(135deg, #666 0%, #444 100%);
  cursor: not-allowed;
  box-shadow: none;
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

@media (max-width: 480px) {
  .donation-box.premium {
    padding: 25px;
  }
  
  .otp-digit {
    width: 50px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>
