<template>
  <div class="proyectos-page">

    <section class="projects-list">
      <h2>Proyectos activos</h2>
      <div class="cards-grid">
        <article v-for="project in proyectos" :key="project.id" class="project-card">
          <div class="card-media">
            <img :src="project.imagen" :alt="project.titulo" />
            <button class="fav-btn" :class="{ active: project.favorito }" @click="toggleFavorito(project.id)">
              <span v-if="project.favorito">★</span>
              <span v-else>☆</span>
            </button>
          </div>
          <div class="card-body">
            <h3>{{ project.titulo }}</h3>
            <p class="meta">Ubicación: <strong>{{ project.ubicacion }}</strong></p>
            <p class="desc">{{ project.descripcion }}</p>
            <div class="card-footer">
              <div class="small">Progreso: {{ project.progreso }}%</div>
              <button class="btn-donar" @click="irADonar(project)">Apoyar proyecto</button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="cta">
      <button class="btn-primary" @click="verFavoritos">Ver favoritos ({{ favoritosCount }})</button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ProyectosView',
  data() {
  return {
    proyectos: [
      {
        id: 'p1',
        titulo: 'Reforestación Bahía Verde',
        ubicacion: 'Bahía Verde, Magdalena',
        descripcion: 'Plantación de mangle rojo en 5 ha y capacitación comunitaria.',
        progreso: 62,
        imagen: require('@/assets/urbanizacion.webp'),
        favorito: false,
        recaudado: 3100000 
      },
      {
        id: 'p2',
        titulo: 'Protección de crías de sábalo',
        ubicacion: 'Estuario Ciénaga',
        descripcion: 'Monitoreo de nurseries y control de pesca artesanal.',
        progreso: 40,
        imagen: require('@/assets/sabalo.webp'),
        favorito: false,
        recaudado: 200000 
      },
      {
        id: 'p3',
        titulo: 'Senderos educativos',
        ubicacion: 'Reserva El Manglar',
        descripcion: 'Construcción de senderos y señalética para visitas guiadas.',
        progreso: 85,
        imagen: require('@/assets/gaviotas.jpg'),
        favorito: false,
        recaudado: 4250000 
      }
    ],
    storageKey: 'proyectos_manglares'
  }
},
computed: {
  meta() {
    const historial = JSON.parse(localStorage.getItem('historial_donaciones') || '[]');
    return historial.reduce((acc, item) => acc + Number(item.monto), 0);
  },
  totalRecaudado() {
    const historial = JSON.parse(localStorage.getItem('historial_donaciones') || '[]');
    return historial.reduce((s, d) => s + Number(d.monto), 0);
  },
  progressPercent() {
    const perc = (this.totalRecaudado / this.meta) * 100;
    return Math.min(Math.round(perc), 100);
  },
  favoritosCount() {
    return this.proyectos.filter(p => p.favorito).length;
  }
},
  methods: {
    toggleFavorito(id) {
      const idx = this.proyectos.findIndex(p => p.id === id)
      if (idx !== -1) {
        this.proyectos[idx].favorito = !this.proyectos[idx].favorito
        this.saveProyectos()
      }
    },
    irADonar(project) {
      window.localStorage.setItem('donar_proyecto', JSON.stringify({ id: project.id, titulo: project.titulo }))
      this.$router.push({ name: 'donar' })
    },
    verFavoritos() {
      const favs = this.proyectos.filter(p => p.favorito)
      if (favs.length === 0) {
        alert('No tienes proyectos favoritos aún.')
        return
      }
      const lista = favs.map(f => `${f.titulo} — ${f.ubicacion}`).join('\n')
      alert(`Proyectos favoritos:\n\n${lista}`)
    },
    saveProyectos() {
      try {
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.proyectos))
      } catch (e) {
  console.error("Error al guardar en localStorage:", e);
}
    },
    loadProyectos() {
      try {
        const raw = window.localStorage.getItem(this.storageKey)
        if (raw) {
          const parsed = JSON.parse(raw)
          this.proyectos = this.proyectos.map(p => {
            const found = parsed.find(x => x.id === p.id)
            return found ? { ...p, ...found } : p
          })
        }
      } catch (e) {
  console.error("Error al cargar de localStorage:", e);
}
    }
  },
  mounted() {
    this.loadProyectos()
  }
}
</script>

<style scoped>
:root {
  --deep-forest: #0a1a15;  
  --leaf-green: #2ecc71;   
  --lime-bright: #58d895;   
  --mint-light: #d1e2d3;    
  --white: #ffffff;
  --glass: rgba(255, 255, 255, 0.05);
}

.proyectos-page {
  background: linear-gradient(135deg, #0a1a15 0%, #0f2f27 40%, #1a3330 100%);
  color: #ffffff;
  min-height: 100vh;
  padding: 80px 20px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.proyectos-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(46, 204, 113, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.page-header {
  text-align: center;
  margin-bottom: 70px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.page-header h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -1px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff, #58d895);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  font-family: 'Poppins', sans-serif;
}

.page-header p {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 400;
}

.progress-section {
  max-width: 950px;
  margin: 0 auto 80px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.progress-label {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 25px;
  color: #58d895;
  text-align: center;
}

.progress-bar {
  height: 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  overflow: hidden;
  margin-bottom: 25px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(46, 204, 113, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71 0%, #58d895 100%);
  box-shadow: 0 0 30px rgba(46, 204, 113, 0.4);
  transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 50px;
}

.progress-numbers {
  font-size: 1.4rem;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 12px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
}

.progress-numbers strong {
  color: #58d895;
  font-size: 1.6rem;
}

.progress-numbers span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  font-weight: 500;
}

.projects-list {
  position: relative;
  z-index: 1;
}

.projects-list h2 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  margin: 0 auto 50px;
  text-align: center;
  padding-bottom: 0;
  position: relative;
  width: fit-content;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 900;
  font-family: 'Poppins', sans-serif;
}

.projects-list h2::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #2ecc71, #58d895);
  border-radius: 50px;
  box-shadow: 0 0 20px rgba(46, 204, 113, 0.4);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1250px;
  margin: 0 auto;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeInUp 0.6s ease-out backwards;
}

.project-card:nth-child(1) { animation-delay: 0s; }
.project-card:nth-child(2) { animation-delay: 0.1s; }
.project-card:nth-child(3) { animation-delay: 0.2s; }

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2ecc71, #58d895);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
  z-index: 10;
}

.project-card:hover::before {
  transform: scaleX(1);
}

.project-card:hover {
  transform: translateY(-12px);
  border-color: rgba(46, 204, 113, 0.3);
  box-shadow: 0 30px 70px rgba(46, 204, 113, 0.15);
  background: rgba(255, 255, 255, 0.08);
}

.card-media {
  position: relative;
  height: 260px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(52, 152, 219, 0.1));
  overflow: hidden;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.project-card:hover .card-media img {
  transform: scale(1.1) rotate(2deg);
}

.fav-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  z-index: 5;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fav-btn:hover {
  transform: scale(1.1);
}

.fav-btn.active {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border-color: #2ecc71;
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
}

.card-body {
  padding: 32px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 16px;
}

.card-body h3 {
  font-size: 1.4rem;
  margin: 0;
  color: #ffffff;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.5px;
  font-family: 'Poppins', sans-serif;
}

.meta {
  font-size: 0.8rem;
  color: #58d895;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: inline-flex;
  gap: 6px;
}

.meta::before {
  content: '📍';
}

.desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 0;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 16px;
  flex-wrap: wrap;
}

.card-footer .small {
  color: rgba(255, 255, 255, 0.65);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-footer .small::before {
  content: '📊';
}

.btn-donar {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
}

.btn-donar:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(46, 204, 113, 0.4);
}

.cta {
  text-align: center;
  margin-top: 100px;
  padding-bottom: 40px;
  position: relative;
  z-index: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border: none;
  color: white;
  padding: 16px 48px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(46, 204, 113, 0.4);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .proyectos-page {
    padding: 60px 16px;
  }

  .page-header {
    margin-bottom: 50px;
  }

  .page-header h1 {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  .page-header p {
    font-size: 1rem;
  }

  .progress-section {
    padding: 30px;
    margin-bottom: 60px;
  }

  .projects-list h2 {
    font-size: 1.8rem;
    margin-bottom: 40px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .card-media {
    height: 200px;
  }

  .card-body {
    padding: 24px;
  }

  .card-body h3 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .proyectos-page {
    padding: 50px 12px;
  }

  .page-header {
    margin-bottom: 40px;
  }

  .page-header h1 {
    font-size: 1.6rem;
  }

  .page-header p {
    font-size: 0.95rem;
  }

  .progress-section {
    padding: 20px;
    margin-bottom: 40px;
  }

  .progress-label {
    font-size: 0.7rem;
  }

  .progress-numbers {
    font-size: 1.2rem;
  }

  .progress-numbers strong {
    font-size: 1.4rem;
  }

  .projects-list h2 {
    font-size: 1.4rem;
    margin-bottom: 30px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-media {
    height: 180px;
  }

  .card-body {
    padding: 20px;
    gap: 12px;
  }

  .card-body h3 {
    font-size: 1.1rem;
  }

  .card-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .btn-donar {
    width: 100%;
    text-align: center;
  }

  .cta {
    margin-top: 60px;
  }

  .btn-primary {
    width: 100%;
    padding: 14px 40px;
  }
}
</style>