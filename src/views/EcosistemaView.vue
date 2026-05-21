<template>
  <div class="ecosistema-view">
    <section class="hero-eco">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="badge-eco">🌿 Ecosistema Vital</span>
        <h1>El Manglar: <span class="text-gradient">Pulmón del Caribe</span></h1>
        <p>Descubre por qué los manglares son esenciales para la vida marina, la protección costera y el equilibrio climático de Santa Marta.</p>
        <button class="btn-scroll" @click="scrollToInfo">
          Explorar el Ecosistema
          <span class="arrow">↓</span>
        </button>
      </div>
    </section>

    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item" v-for="(stat, index) in ecosystemStats" :key="index">
          <div class="stat-img"><img :src="stat.imagen" :alt="stat.label" /></div>
          <div class="stat-number">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <section class="functions-section" id="info">
      <div class="section-header">
        <h2>¿Por qué son tan importantes?</h2>
        <p>Los manglares cumplen funciones vitales para nuestro ecosistema costero.</p>
      </div>
      <div class="functions-grid">
        <div class="function-card" v-for="(func, index) in funciones" :key="index">
          <div class="function-img"><img :src="func.imagen" :alt="func.titulo" /></div>
          <h3>{{ func.titulo }}</h3>
          <p>{{ func.descripcion }}</p>
          <div class="function-impact">
            <span class="impact-label">Impacto:</span>
            <span class="impact-value">{{ func.impacto }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="species-section">
      <div class="section-header">
        <h2>Especies que dependen del Manglar</h2>
        <p>Un refugio crucial para la biodiversidad del Caribe colombiano.</p>
      </div>
      <div class="species-carousel">
        <div class="species-card" v-for="(especie, index) in especies" :key="index" @click="selectEspecie(especie)">
          <div class="species-image">
            <img :src="especie.imagen" :alt="especie.nombre" />
          </div>
          <div class="species-info">
            <h4>{{ especie.nombre }}</h4>
            <span class="species-status" :class="especie.estado">{{ especie.estadoTexto }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de Especie -->
    <div class="modal-overlay" v-if="especieSeleccionada" @click="cerrarModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="cerrarModal">×</button>
        <div class="modal-body">
          <div class="modal-image">
            <img :src="especieSeleccionada.imagen" :alt="especieSeleccionada.nombre" />
          </div>
          <div class="modal-info">
            <h3>{{ especieSeleccionada.nombre }}</h3>
            <span class="species-status" :class="especieSeleccionada.estado">{{ especieSeleccionada.estadoTexto }}</span>
            <p class="modal-desc">{{ especieSeleccionada.descripcion }}</p>
            <div class="modal-details">
              <div class="detail-item">
                <span class="detail-label">Hábitat:</span>
                <span class="detail-value">{{ especieSeleccionada.habitat }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Dieta:</span>
                <span class="detail-value">{{ especieSeleccionada.dieta }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Conservación:</span>
                <span class="detail-value">{{ especieSeleccionada.conservacion }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="threats-section">
      <div class="section-header">
        <h2> Retos y Conservación</h2>
        <p>Conoce los desafíos que enfrentan los manglares y cómo puedes ayudar.</p>
      </div>
      <div class="threats-grid">
        <div class="threat-card" v-for="(amenaza, index) in amenazas" :key="index">
          <div class="threat-header">
            <img :src="amenaza.imagen" :alt="amenaza.titulo" class="threat-img" />
            <h3>{{ amenaza.titulo }}</h3>
          </div>
          <p>{{ amenaza.descripcion }}</p>
          <div class="threat-action">
            <span class="action-label">¿Cómo ayudar?</span>
            <p class="action-text">{{ ayuda.acciones[index] }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-content">
        <h2>¡Únete a la Conservación!</h2>
        <p>Cada árbol plantado, cada voluntario, cada donación marca la diferencia.</p>
        <div class="cta-buttons">
          <button class="btn-primary" @click="donar">Donar Ahora</button>
          <button class="btn-secondary" @click="voluntario">Ser Voluntario</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'EcosistemaView',
  data() {
    return {
      especieSeleccionada: null,
     ecosystemStats: [
  { imagen: require('@/assets/arboles plantados ecosistema.avif'), value: '1,200+', label: 'Árboles Plantados' },
  { imagen: require('@/assets/area protegida.jpg'), value: '45 ha', label: 'Área Protegida' },
  { imagen: require('@/assets/especies registradas.avif'), value: '85+', label: 'Especies Registradas' },
  { imagen: require('@/assets/filtracion del agua.avif'), value: '98%', label: 'Filtración de Agua' }
],
funciones: [
  { imagen: require('@/assets/filtro natural.jpg'), titulo: 'Filtro Natural', descripcion: 'Las raíces complejas del manglar actúan como un filtro biológico que captura sedimentos, contaminantes y nutrientes antes de que lleguen al océano.', impacto: 'Purifica hasta 98% de partículas' },
  { imagen: require('@/assets/proteccion costera.webp'), titulo: 'Protección Costera', descripcion: 'Los manglares absorben hasta el 90% de la energía de las olas y tormentas, protegiendo comunidades costeras de la erosión y fenómenos climáticos.', impacto: 'Reduce erosión en 70%' },
  { imagen: require('@/assets/cria y refugio.jpg'), titulo: 'Cría y Refugio', descripcion: 'Sus raíces subacuáticas crean un laberinto seguro donde peces, crustáceos y moluscos encuentran alimento y protección durante sus primeras etapas de vida.', impacto: '85% de especies marinas' },
  { imagen: require('@/assets/captura de carbono.avif'), titulo: 'Captura de Carbono', descripcion: 'Los manglares almacenan hasta 4 veces más carbono que los bosques tropicales terrestres, siendo aliados clave contra el cambio climático.', impacto: '10x más carbono/área' },
  { imagen: require('@/assets/investigacion cientifica.jpg'), titulo: 'Investigación Científica', descripcion: 'Son laboratorios vivos donde científicos estudian la adaptación marina, biodiversidad tropical y efectos del cambio climático.', impacto: '50+ estudios/anuales' },
  { imagen: require('@/assets/pezca.jpg'), titulo: 'Economía Local', descripcion: 'Apoyan la pesca artesanal y el ecoturismo, generando ingresos sostenibles para las comunidades locales de Santa Marta.', impacto: '$2M anuales local' }
],
      especies: [
        { 
          nombre: 'Cangrejo Azul', 
          imagen: require('@/assets/cangrejo-azul.avif'),
          estado: 'vulnerable',
          estadoTexto: 'Vulnerable',
          descripcion: 'El cangrejo azul es un ingeniero ecológico fundamental. Excava galerías en el suelo del manglar que permiten la circulación de oxígeno y nutrientes, beneficiando a todo el ecosistema.',
          habitat: 'Suelo fangoso del manglar',
          dieta: 'Omnívoro (hojarasca, detritos)',
          conservacion: 'Protección de humedales'
        },
        { 
          nombre: 'Garza Blanca', 
          imagen: require('@/assets/garza blanca.jpg'),
          estado: 'protegida',
          estadoTexto: 'Bajo Protección',
          descripcion: 'Esta elegante ave utiliza las copas de los manglares para anidar en colonias, protegiendo a sus crías de depredadores y de las mareas altas.',
          habitat: 'Copas de mangle rojo',
          dieta: 'Peces, crustáceos, insectos',
          conservacion: 'Áreas de anidación protegidas'
        },
        { 
          nombre: 'Mangle Rojo', 
          imagen: require('@/assets/mangle rojo.jpg'),
          estado: 'esencial',
          estadoTexto: 'Especie Clave',
          descripcion: 'El mangle rojo (Rhizophora mangle) es la especie dominante del ecosistema. Sus raíces zancudas características le permiten vivir sumergidas y soportar la salinidad.',
          habitat: 'Zona intermareal',
          dieta: 'Fotosíntesis',
          conservacion: 'Reforestación activa'
        },
        { 
          nombre: 'Sábalo', 
          imagen: require('@/assets/sabalo.webp'),
          estado: 'comercial',
          estadoTexto: 'Importancia Comercial',
          descripcion: 'El sábalo utiliza el manglar como guardería durante sus primeros meses de vida, aprovechando la protección de las raíces y la abundancia de alimento.',
          habitat: 'Raíces subacuáticas',
          dieta: 'Plancton, insectos acuáticos',
          conservacion: 'Tallas mínimas de pesca'
        }
      ],
      amenazas: [
        { 
          imagen: require('@/assets/urbanizacion.webp'), 
          titulo: 'Urbanización', 
          descripcion: 'La expansión urbana y el desarrollo costero han reducido significativamente las áreas de manglar en las últimas décadas.' 
        },
        { 
          imagen: require('@/assets/contaminacion.jpg'), 
          titulo: 'Contaminación', 
          descripcion: 'Los residuos industriales y agrícolas filtran contaminantes que afectan la salud del ecosistema y las especies que lo habitan.' 
        },
        { 
          imagen: require('@/assets/Sobrepesca.webp'), 
          titulo: 'Sobrepesca', 
          descripcion: 'La pesca excesiva desequilibra la cadena trófica y reduce las poblaciones de especies clave para el manglar.' 
        },
        { 
          imagen: require('@/assets/cambio climatico.jpg'), 
          titulo: 'Cambio Climático', 
          descripcion: 'El aumento del nivel del mar y las temperaturas afectan la distribución y supervivencia de las especies de manglar.' 
        }
      ],
      ayuda: {
        acciones: [
          'Participa en jornadas de reforestación y limpieza de manglares',
          'Reduce tu consumo de plásticos y apoya iniciativas de limpieza costera',
          'Compra productos de pesca sostenible y respeta las tallas mínimas',
          'Educa a otros sobre la importancia de los manglares y sus beneficios'
        ]
      }
    }
  },
  methods: {
    scrollToInfo() {
      document.getElementById('info').scrollIntoView({ behavior: 'smooth' });
    },
    selectEspecie(especie) {
      this.especieSeleccionada = especie;
      document.body.style.overflow = 'hidden';
    },
    cerrarModal() {
      this.especieSeleccionada = null;
      document.body.style.overflow = '';
    },
    donar() {
    this.$router.push('/donar');
  },
  voluntario() {
    this.$router.push('/voluntariado');
  }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

.ecosistema-view {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #0a1f1a;
  color: white;
  min-height: 100vh;
}

.hero-eco {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('@/assets/fondo-hero.png');
  background-size: cover;
  background-position: center;
  padding: 120px 20px;
  border-radius: 0 0 60px 60px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(10, 31, 26, 0.4) 0%, rgba(10, 31, 26, 0.8) 100%);
  border-radius: 0 0 60px 60px;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}
.stat-img {
  width: 60px;
  height: 60px;
  margin: 0 auto 10px auto;
  border-radius: 50%;
  overflow: hidden;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.function-img {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px auto;
  border-radius: 18px;
  overflow: hidden;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.function-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.badge-eco {
  display: inline-block;
  background: rgba(139, 195, 74, 0.2);
  border: 1px solid rgba(139, 195, 74, 0.4);
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #8bc34a;
  margin-bottom: 20px;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.text-gradient {
  background: linear-gradient(90deg, #8bc34a, #ffffff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-content p {
  font-size: 1.2rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 30px;
}

.btn-scroll {
  background: #8bc34a;
  color: #0a1f1a;
  border: none;
  padding: 15px 35px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-scroll:hover {
  background: #ffeb3b;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(139, 195, 74, 0.3);
}

.arrow {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.stats-section {
  margin-top: -50px;
  position: relative;
  z-index: 10;
  padding: 0 20px;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 30px 40px;
  border-radius: 25px;
  text-align: center;
  flex: 1;
  min-width: 200px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(139, 195, 74, 0.15);
  border-color: rgba(139, 195, 74, 0.4);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #8bc34a;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
}

.functions-section {
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #8bc34a;
  margin-bottom: 15px;
}

.section-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

.functions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.function-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 35px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.function-card:hover {
  background: rgba(139, 195, 74, 0.1);
  border-color: rgba(139, 195, 74, 0.3);
  transform: translateY(-5px);
}

.function-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.function-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 15px;
}

.function-card p {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  margin-bottom: 20px;
}

.function-impact {
  background: rgba(139, 195, 74, 0.15);
  padding: 12px 18px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.impact-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.impact-value {
  color: #8bc34a;
  font-weight: 700;
}

.species-section {
  padding: 80px 20px;
  background: rgba(0, 0, 0, 0.2);
}

.species-carousel {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding: 20px 0;
  max-width: 1200px;
  margin: 0 auto;
  scroll-snap-type: x mandatory;
}

.species-card {
  flex: 0 0 280px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  scroll-snap-align: start;
}

.species-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.species-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.species-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.species-card:hover .species-image img {
  transform: scale(1.1);
}

.species-info {
  padding: 20px;
}

.species-info h4 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.species-status {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.species-status.vulnerable {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

.species-status.protegida {
  background: rgba(139, 195, 74, 0.2);
  color: #8bc34a;
}

.species-status.esencial {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.species-status.comercial {
  background: rgba(156, 39, 176, 0.2);
  color: #9c27b0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #1a2e28;
  border-radius: 30px;
  max-width: 800px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.modal-image {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  padding: 40px;
}

.modal-info h3 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.modal-desc {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 20px 0;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-label {
  color: rgba(255, 255, 255, 0.6);
}

.detail-value {
  color: #8bc34a;
  font-weight: 600;
}

.threats-section {
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.threats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.threat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 30px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.threat-card:hover {
  background: rgba(255, 82, 82, 0.1);
  border-color: rgba(255, 82, 82, 0.3);
}

.threat-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.threat-icon {
  font-size: 2rem;
}

.threat-img {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
}

.threat-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
}

.threat-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 20px;
}

.threat-action {
  background: rgba(139, 195, 74, 0.1);
  padding: 15px;
  border-radius: 12px;
}

.action-label {
  display: block;
  color: #8bc34a;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.action-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0;
}

.cta-section {
  padding: 100px 20px;
  background: linear-gradient(135deg, rgba(139, 195, 74, 0.15) 0%, rgba(10, 31, 26, 0.9) 100%);
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 15px;
}

.cta-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-bottom: 40px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #8bc34a;
  color: #0a1f1a;
  border: none;
  padding: 16px 40px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #ffeb3b;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(139, 195, 74, 0.4);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 14px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .stats-container {
    flex-direction: column;
  }
  
  .functions-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-body {
    grid-template-columns: 1fr;
  }
  
  .modal-image {
    min-height: 250px;
  }
}
</style>