<template>
  <div class="educacion-page">
    <header class="page-header">
      <h1>Educación y Talleres</h1>
      <p>Aprende sobre la importancia del manglar y participa en talleres comunitarios.</p>
    </header>

    <section class="resources">
      <h2>Recursos</h2>
      <ul class="resource-list">
        <li v-for="(r, i) in recursos" :key="i">
          <router-link :to="{ name: r.routeName }" class="resource-link">
            {{ r.titulo }}
          </router-link>
          <p class="small">{{ r.descripcion }}</p>
        </li>
      </ul>
    </section>

    <section class="workshops">
      <h2>Próximos talleres</h2>
      <div class="workshop-grid">
        <div v-for="t in talleres" :key="t.id" class="workshop-card">
          <h3>{{ t.titulo }}</h3>
          <p class="meta">{{ t.fecha }} — {{ t.lugar }}</p>
          <p>{{ t.resumen }}</p>
          <button class="btn-signup" @click="prellenarTaller(t)">Inscribirme</button>
        </div>
      </div>
    </section>

    <section class="signup" ref="formularioInscripcion">
      <h2>Inscripción a taller</h2>
      <form @submit.prevent="enviarInscripcion" class="signup-form">
        <div class="row">
          <label>Nombre</label>
          <input v-model="form.nombre" required />
        </div>
        <div class="row">
          <label>Correo</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div class="row">
          <label>Taller</label>
          <select v-model="form.taller" required>
            <option disabled value="">Selecciona un taller</option>
            <option v-for="t in talleres" :key="t.id" :value="t.titulo">{{ t.titulo }}</option>
          </select>
        </div>
        <div class="row">
          <label>Comentarios</label>
          <textarea v-model="form.comentarios" rows="3"></textarea>
        </div>
        <div class="actions">
          <button type="submit" :disabled="enviando">
            {{ enviando ? 'Enviando...' : 'Enviar inscripción' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'EducacionView',
  data() {
    return {
      recursos: [
        { titulo: 'Guía básica del manglar', routeName: 'guia-manglar', descripcion: 'Conceptos, especies y conservación.' },
        { titulo: 'Manual de reforestación comunitaria', routeName: 'manual-reforestacion', descripcion: 'Pasos para plantar y cuidar mangle.' },
        { titulo: 'Informe de impacto 2025', routeName: 'informe-impacto', descripcion: 'Resultados y transparencia de proyectos.' }
      ],
      talleres: [
        { id: 't1', titulo: 'Plantación comunitaria', fecha: '2026-05-15', lugar: 'Bahía Verde', resumen: 'Jornada práctica de plantación y cuidado.' },
        { id: 't2', titulo: 'Monitoreo de fauna', fecha: '2026-06-02', lugar: 'Reserva El Manglar', resumen: 'Técnicas de conteo y registro de especies.' },
        { id: 't3', titulo: 'Educación ambiental para escuelas', fecha: '2026-06-20', lugar: 'Centro Comunitario', resumen: 'Materiales y dinámicas para docentes.' }
      ],
      form: { nombre: '', email: '', taller: '', comentarios: '' },
      enviando: false
    }
  },
  methods: {
    prellenarTaller(taller) {
      this.form.taller = taller.titulo;
      this.$nextTick(() => {
        const el = this.$refs.formularioInscripcion;
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    },
    enviarInscripcion() {
      if (!this.form.nombre || !this.form.email || !this.form.taller) return;
      this.enviando = true;
      setTimeout(() => {
        this.enviando = false;
        const saved = JSON.parse(window.localStorage.getItem('registro_voluntarios') || '[]');
        saved.push({
          nombre: this.form.nombre,
          correo: this.form.email,
          habilidad: 'Taller: ' + this.form.taller,
          fecha: new Date().toLocaleDateString()
        });
        window.localStorage.setItem('registro_voluntarios', JSON.stringify(saved));
        alert('¡Inscripción exitosa!');
        this.form = { nombre: '', email: '', taller: '', comentarios: '' };
      }, 800);
    }
  }
}
</script>

<style scoped>
.resource-link {
  color: #e8f544;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  display: inline-block;
  margin-bottom: 5px;
  transition: opacity 0.2s;
}

.resource-link:hover {
  text-decoration: underline;
  opacity: 0.8;
}
:root {
  --deep-forest: #061a13;
  --leaf-green: #1f6f2a;
  --lime-bright: #e8f544;
  --mint-light: #d1e2d3;
  --white: #ffffff;
  --glass: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
}

.educacion-page {
  background-color: #061a13;
  color: var(--white);
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(to bottom, #fff, #a2bca5);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.page-header p {
  color: #d1e2d3;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
}

h2 {
  font-size: 1.8rem;
  margin: 40px 0 20px;
  border-left: 4px solid #e8f544;
  padding-left: 15px;
  color: #fff;
}

.resource-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 20px;
}

.resource-list li {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.resource-list li:hover {
  background: rgba(255, 255, 255, 0.07);
  transform: translateX(10px);
  border-color: #1f6f2a;
}

.resource-list a {
  color: #e8f544;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  display: inline-block;
  margin-bottom: 5px;
}

.resource-list a:hover {
  text-decoration: underline;
}

.small {
  color: #d1e2d3;
  margin: 0;
  opacity: 0.8;
}

.workshop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.workshop-card {
  background: #0a251c;
  padding: 25px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.workshop-card:hover {
  transform: translateY(-5px);
  border-color: #1f6f2a;
}

.workshop-card h3 {
  color: #fff;
  margin-top: 0;
  font-size: 1.4rem;
}

.workshop-card .meta {
  color: #e8f544;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 15px;
}

.workshop-card p {
  color: #d1e2d3;
  flex-grow: 1;
  line-height: 1.5;
}

.btn-signup {
  background: #1f6f2a;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
}

.btn-signup:hover {
  background: #e8f544;
  color: #061a13;
}

.signup {
  background: rgba(255, 255, 255, 0.03);
  padding: 40px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.signup-form {
  display: grid;
  gap: 20px;
}

.row label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #d1e2d3;
  font-size: 0.9rem;
}

.row input, .row select, .row textarea {
  width: 100%;
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  transition: border-color 0.3s;
}

.row input:focus, .row select:focus, .row textarea:focus {
  outline: none;
  border-color: #e8f544;
}

.actions {
  text-align: center;
  margin-top: 20px;
}

.actions button {
  background: #e8f544;
  color: #061a13;
  padding: 15px 40px;
  border-radius: 50px;
  border: none;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
}

.actions button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(232, 245, 68, 0.3);
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

select option {
  background: #0a251c;
  color: #fff;
}
</style>
