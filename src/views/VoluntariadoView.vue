<template>
  <div class="voluntariado-container">
    <div class="voluntariado-grid">
      <aside class="hero-panel">
        <div class="hero-badge">Voluntariado</div>
        <h1>Transforma tu tiempo en acción para los manglares</h1>
        <p>Regístrate para apoyar jornadas de siembra, limpieza y monitoreo ambiental en la comunidad.</p>

        <div class="benefit-list">
          <div class="benefit-item">
            <span class="benefit-icon">🌿</span>
            <div>
              <strong>Impacto directo</strong>
              <p>Tu compromiso ayuda a regenerar manglares y conservar vida silvestre.</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">🤝</span>
            <div>
              <strong>Red comunitaria</strong>
              <p>Trabaja junto a otros voluntarios y líderes ambientales.</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">📅</span>
            <div>
              <strong>Actividades claras</strong>
              <p>Recibe coordinación y apoyo para cada jornada de trabajo.</p>
            </div>
          </div>
        </div>
      </aside>

      <transition name="slide-fade" mode="out-in">
        <div class="form-card animate-pop" :class="{ submitting }" :key="submitting ? 'loading' : 'form'">
          <div class="card-header">
            <div class="icon-badge"></div>
            <h2>Únete a la <span class="text-gradient">Próxima Jornada</span></h2>
            <p>Comparte tus datos y te contactaremos para la próxima actividad.</p>
          </div>

          <form @submit.prevent="enviarSolicitud" class="premium-form">
            <div class="input-group">
            <label>Nombre Completo</label>
            <div class="input-wrapper">
              <input 
                type="text" 
                v-model="form.nombre" 
                placeholder="Ej. Jean Freyder" 
                required
              >
            </div>
          </div>

          <div class="input-group">
            <label>Correo Electrónico</label>
            <div class="input-wrapper">
              <input 
                type="email" 
                v-model="form.email" 
                placeholder="tu@correo.com" 
                required
              >
            </div>
          </div>

          <div class="input-group">
            <label>Área de Interés</label>
            <select v-model="form.habilidad" required class="premium-select">
              <option value="" disabled>¿Cómo quieres ayudar?</option>
              <option value="Siembra directa">Siembra directa de manglar</option>
              <option value="Recolección de residuos">Recolección de residuos</option>
              <option value="Fotografía/Registro">Fotografía y Registro</option>
            </select>
          </div>

          <button type="submit" class="btn-submit-premium" :class="{ loading: submitting }" :disabled="formularioInvalido || submitting">
            <span v-if="submitting" class="button-spinner"></span>
            {{ submitting ? 'Enviando...' : 'Registrarme como Voluntario' }}
            <span class="arrow">→</span>
          </button>
        </form>
        
        <p class="footer-note">Al registrarte, te contactaremos para la próxima jornada en la Ciénaga.</p>
      </div>
      </transition>
    </div>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data() {
    return {
      form: {
        nombre: '',
        email: '',
        habilidad: '' 
      },
      submitting: false
    }
  },
  methods: {
    async enviarSolicitud() {
      if (!this.form.nombre || !this.form.email || this.form.habilidad === '') {
        alert("Por favor, completa todos los campos correctamente.");
        return;
      }

      this.submitting = true;
      await this.guardarEnLocalStorage();
      setTimeout(() => {
        alert(`¡Excelente registro! Pronto nos comunicaremos contigo.`);
        this.$router.push('/');
      }, 280);
    },

    async guardarEnLocalStorage() {
      const nuevoVoluntario = {
        nombre: this.form.nombre,
        correo: this.form.email,
        habilidad: this.form.habilidad,
        fecha: new Date().toLocaleDateString()
      };

      let lista = JSON.parse(localStorage.getItem('registro_voluntarios')) || [];
      lista.push(nuevoVoluntario);
      localStorage.setItem('registro_voluntarios', JSON.stringify(lista));

      try {
        await api.post('/volunteers', nuevoVoluntario);
      } catch (error) {
        console.warn('Error backend voluntariado:', error);
      }
      this.submitting = false;
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');

.voluntariado-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(rgba(8, 28, 21, 0.7), rgba(12, 45, 29, 0.8)), url('@/assets/fondo-voluntarios.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed; 
  
  padding: 25px;
  font-family: 'Inter', sans-serif;
}

.voluntariado-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
}

.hero-panel {
  background: rgba(18, 56, 39, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  padding: 40px;
  color: #f8fcf2;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #d8f5e4;
  font-weight: 700;
  margin-bottom: 20px;
}

.hero-panel h1 {
  margin-bottom: 18px;
  font-size: 2.4rem;
  line-height: 1.05;
}

.hero-panel p {
  color: rgba(255, 255, 255, 0.78);
  margin-bottom: 28px;
  font-size: 1rem;
  max-width: 520px;
}

.benefit-list {
  display: grid;
  gap: 18px;
}

.benefit-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
}

.benefit-icon {
  font-size: 1.8rem;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
}

.benefit-item strong {
  display: block;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 4px;
}

.benefit-item p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-card {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  padding: 36px;
  border-radius: 32px;
  width: 100%;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25);
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.card-header {
  margin-bottom: 30px;
}


.icon-badge {
  font-size: 32px;
  background: #e8f5e9;
  width: 65px;
  height: 65px;
  line-height: 65px;
  border-radius: 18px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-badge::after {
  content: "🤝";
}

h2 {
  color: #1b4332;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 10px;
}

.text-gradient {
  background: linear-gradient(to right, #2d6a4f, #74c69d);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #4b5563; 
  font-size: 14px;
  line-height: 1.5;
}

.premium-form {
  text-align: left;
}

.input-group {
  margin-bottom: 22px;
}

label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #374151;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

input, .premium-select {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  font-size: 15px;
  transition: all 0.3s ease;
  color: #1f2937;
  box-sizing: border-box;
}

input:focus, .premium-select:focus {
  border-color: #2d6a4f;
  background: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(45, 106, 79, 0.1);
  transform: translateY(-2px);
}

.btn-submit-premium {
  width: 100%;
  padding: 18px;
  background: #1b4332;
  color: #74c69d;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: 10px;
}

.btn-submit-premium:hover {
  background: #2d6a4f;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(27, 67, 50, 0.3);
}

.btn-submit-premium.loading {
  pointer-events: none;
  opacity: 0.85;
  background: #4f7942;
}

.button-spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.form-card.submitting {
  transform: translateY(-4px);
  opacity: 0.97;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.arrow {
  transition: transform 0.3s;
}

.btn-submit-premium:hover .arrow {
  transform: translateX(5px);
}

.footer-note {
  margin-top: 25px;
  font-size: 12px;
  color: #6b7280;
}

.animate-pop {
  animation: popIn 0.5s cubic-bezier(0.26, 0.53, 0.74, 1.48);
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
</style>