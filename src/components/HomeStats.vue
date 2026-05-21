<template>
  <div>
    <section class="impact-stats" id="impacto">
      <div class="stats-wrapper">
        <div class="stat-card">
          <div class="stat-val">+{{ formattedArboles }}</div>
          <div class="stat-lab">Árboles Plantados</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ stats.area }}ha</div>
          <div class="stat-lab">Área Protegida</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ stats.transparencia }}%</div>
          <div class="stat-lab">Transparencia</div>
        </div>
      </div>
    </section>

    <section class="section species-section" id="info">
      <div class="container-inner">
        <h2 class="section-title">Vida que depende del Manglar</h2>
        <p class="section-subtitle">Miles de especies dependen de este refugio natural para sobrevivir en nuestras costas.</p>
        <div class="cards-container">
          <div class="info-card">
            <div class="card-image">
              <img src="@/assets/cangrejo-azul.avif" alt="Cangrejo Azul" />
            </div>
            <h3>Cangrejo Azul</h3>
            <p>Ingeniero del suelo que oxigena las raíces al excavar.</p>
          </div>
          <div class="info-card">
            <div class="card-image">
              <img src="@/assets/garza blanca.jpg" alt="Garza Blanca" />
            </div>
            <h3>Garza Blanca</h3>
            <p>Utiliza las copas altas para anidar y proteger a sus crías.</p>
          </div>
          <div class="info-card">
            <div class="card-image">
              <img src="@/assets/mangle rojo.jpg" alt="Mangle Rojo" />
            </div>
            <h3>Mangle Rojo</h3>
            <p>Sus raíces zancudas son el principal escudo contra el oleaje.</p>
          </div>
          <div class="info-card">
            <div class="card-image">
              <img src="@/assets/sabalo.webp" alt="Sábalo" />
            </div>
            <h3>Sábalo</h3>
            <p>Utiliza el laberinto de raíces como guardería en sus primeros meses.</p>
          </div>
          <div class="info-card">
            <div class="card-image">
              <img src="@/assets/gaviotas.jpg" alt="Gaviotas" />
            </div>
            <h3>Gaviotas</h3>
            <p>Vuelan sobre el manglar en busca de alimento y ayudan a dispersar nutrientes.</p>
          </div>
          <div class="info-card">
            <div class="card-image">
              <img src="@/assets/tigrebengala.jpg" alt="Tigre de Bengala" />
            </div>
            <h3>Tigre de Bengala</h3>
            <p>Depredador que en algunos manglares utiliza este ecosistema para cazar y desplazarse.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeStats',
  data() {
    return {
      stats: {
        arboles: 0,
        area: 0,
        transparencia: 0
      },
      goals: {
        arboles: 1200,
        area: 45,
        transparencia: 100
      },
      liveUpdate: null,
      storageKey: 'homeStatsSession',
      hasSavedStats: false
    }
  },
  computed: {
    formattedArboles() {
      return this.stats.arboles.toLocaleString()
    }
  },
  mounted() {
    this.loadStats()
    if (!this.hasSavedStats) {
      this.animateStats()
    }
    this.liveUpdate = window.setInterval(this.incrementStats, 1000)
  },
  beforeUnmount() {
    window.clearInterval(this.liveUpdate)
  },
  methods: {
    loadStats() {
      const saved = window.sessionStorage.getItem(this.storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        this.stats = {
          arboles: parsed.arboles || this.goals.arboles,
          area: parsed.area || this.goals.area,
          transparencia: parsed.transparencia || this.goals.transparencia
        }
        this.hasSavedStats = true
      } else {
        this.stats = {
          arboles: 0,
          area: 0,
          transparencia: 0
        }
        this.hasSavedStats = false
      }
    },
    saveStats() {
      window.sessionStorage.setItem(this.storageKey, JSON.stringify(this.stats))
    },
    animateStats() {
      const duration = 2000
      const start = performance.now()
      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1)
        this.stats.arboles = Math.round(this.goals.arboles * progress)
        this.stats.area = Math.round(this.goals.area * progress)
        this.stats.transparencia = Math.round(this.goals.transparencia * progress)
        if (progress < 1) {
          window.requestAnimationFrame(step)
        } else {
          this.saveStats()
        }
      }
      window.requestAnimationFrame(step)
    },
    incrementStats() {
      if (this.stats.arboles < this.goals.arboles) {
        this.stats.arboles = Math.min(this.stats.arboles + 7, this.goals.arboles)
      } else {
        this.stats.arboles += 1
      }

      if (this.stats.area < this.goals.area) {
        this.stats.area = Math.min(this.stats.area + 1, this.goals.area)
      } else if (this.stats.area < this.goals.area + 10) {
        this.stats.area += 1
      }

      if (this.stats.transparencia < this.goals.transparencia) {
        this.stats.transparencia = Math.min(this.stats.transparencia + 2, this.goals.transparencia)
      }

      this.saveStats()
    }
  }
}
</script>

<style scoped>


.impact-stats {
  margin-top: -80px;
  position: relative;
  z-index: 10;
  padding: 0 20px;
  animation: fadeInUp 0.8s ease-out 0.6s backwards;
}

.stats-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 251, 250, 0.88) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(46, 204, 113, 0.2);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(46, 204, 113, 0.1), transparent);
  transition: left 0.6s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary);
}

.stat-val {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
  margin-bottom: 12px;
}

.stat-lab {
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  word-break: break-word;
}


.species-section {
  padding: 140px 40px;
  text-align: center;
  background: linear-gradient(180deg, #f8fbfa 0%, #ecf8f2 100%);
  position: relative;
  overflow: hidden;
}

.species-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(46, 204, 113, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.species-section::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(52, 152, 219, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.section-subtitle {
  color: var(--text-secondary);
  margin-bottom: 70px;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1rem;
  line-height: 1.8;
  position: relative;
  z-index: 1;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.info-card {
  background: var(--color-white);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: left;
  animation: fadeInUp 0.6s ease-out backwards;
  position: relative;
}

.info-card:nth-child(1) { animation-delay: 0s; }
.info-card:nth-child(2) { animation-delay: 0.1s; }
.info-card:nth-child(3) { animation-delay: 0.2s; }
.info-card:nth-child(4) { animation-delay: 0.1s; }
.info-card:nth-child(5) { animation-delay: 0.2s; }
.info-card:nth-child(6) { animation-delay: 0.3s; }

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.info-card:hover::before {
  transform: scaleX(1);
}

.info-card:hover {
  transform: translateY(-20px);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary);
}

.card-image {
  width: 100%;
  height: 240px;
  border-radius: 0;
  overflow: hidden;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--color-primary-ultra-light) 0%, rgba(46, 204, 113, 0.1) 100%);
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-card:hover .card-image img {
  transform: scale(1.12) rotate(1deg);
}

.info-card h3 {
  color: var(--color-primary-dark);
  font-weight: 800;
  margin: 0 24px 12px;
  font-size: 1.35rem;
  letter-spacing: -0.5px;
}

.info-card p {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 0.95rem;
  margin: 0 24px 24px;
}


@media (max-width: 1024px) {
  .species-section {
    padding: 100px 30px;
  }

  .cards-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .impact-stats {
    margin-top: -60px;
    padding: 0 16px;
  }

  .stats-wrapper {
    gap: 16px;
    padding: 0 16px;
  }

  .stat-card {
    padding: 32px 24px;
  }

  .species-section {
    padding: 80px 20px;
  }

  .section-title {
    font-size: 2rem;
  }

  .cards-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .card-image {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .impact-stats {
    margin-top: -40px;
    padding: 0;
  }

  .stats-wrapper {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 12px;
  }

  .stat-card {
    padding: 24px 16px;
    border-radius: 16px;
  }

  .stat-val {
    font-size: 2rem;
  }

  .stat-lab {
    font-size: 0.85rem;
  }

  .species-section {
    padding: 60px 16px;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  .section-subtitle {
    font-size: 0.95rem;
    margin-bottom: 40px;
  }

  .cards-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-image {
    height: 150px;
  }

  .info-card h3 {
    font-size: 1.15rem;
    margin-left: 16px;
    margin-right: 16px;
  }

  .info-card p {
    margin-left: 16px;
    margin-right: 16px;
    font-size: 0.9rem;
  }
}
</style>
