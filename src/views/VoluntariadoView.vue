<template>
  <div class="voluntariado-container">
    <div class="form-card animate-pop">
      
      <div class="card-header">
        <div class="icon-badge"></div>
        <h2>Únete a la <span class="text-gradient">Próxima Jornada</span></h2>
        <p>No necesitas experiencia, solo ganas de proteger el ecosistema de Santa Marta.</p>
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
            <option value="" disabled selected>¿Cómo quieres ayudar?</option>
            <option value="Siembra directa"> Siembra directa de manglar</option>
            <option value="Recolección de residuos"> Recolección de residuos</option>
            <option value="Fotografía/Registro"> Fotografía y Registro</option>
          </select>
        </div>

        <button type="submit" class="btn-submit-premium">
          Registrarme como Voluntario
          <span class="arrow">→</span>
        </button>
      </form>
      
      <p class="footer-note">Al registrarte, te contactaremos para la próxima jornada en la Ciénaga.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        nombre: '',
        email: '',
        habilidad: '' 
      }
    }
  },
  methods: {
    enviarSolicitud() {
      if (!this.form.nombre || !this.form.email || this.form.habilidad === '') {
        alert("Por favor, completa todos los campos correctamente.");
        return;
      }

      this.guardarEnLocalStorage();
      alert(`¡Excelente registro! Pronto nos comunicaremos contigo.`);
      this.$router.push('/');
    },

    guardarEnLocalStorage() {
      const nuevoVoluntario = {
        nombre: this.form.nombre,
        correo: this.form.email,
        habilidad: this.form.habilidad,
        fecha: new Date().toLocaleDateString()
      };

      let lista = JSON.parse(localStorage.getItem('registro_voluntarios')) || [];
      lista.push(nuevoVoluntario);
      localStorage.setItem('registro_voluntarios', JSON.stringify(lista));
    }
  }
}
</script>

<style scoped>

.voluntariado-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1b4332 0%, #081c15 100%); /* Fondo oscuro elegante */
  padding: 25px;
  font-family: 'Inter', sans-serif;
}

.form-card {
  background: rgba(255, 255, 255, 0.98);
  padding: 45px;
  border-radius: 28px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.card-header {
  margin-bottom: 35px;
}

.icon-badge {
  font-size: 32px;
  background: #e8f5e9;
  width: 65px;
  height: 65px;
  line-height: 65px;
  border-radius: 18px;
  margin: 0 auto 15px;
}

h2 {
  color: #1b4332;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 10px;
}

.text-gradient {
  background: linear-gradient(to right, #2d6a4f, #74c69d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #6b7280;
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
  border: 2px solid #f3f4f6;
  background: #f9fafb;
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
  box-shadow: 0 10px 20px rgba(27, 67, 50, 0.2);
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
  color: #000000;
}

.animate-pop {
  animation: popIn 0.5s cubic-bezier(0.26, 0.53, 0.74, 1.48);
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
</style>