<template>
  <div class="news-page">
    <header class="page-header">
      <h1>Noticias y Actualizaciones</h1>
      <p>Mantente al día con las últimas novedades de EcoManglar</p>
    </header>

    <section class="news-list">
      <article v-for="news in newsList" :key="news.id" class="news-card">
        <div class="news-image">
          <img :src="news.image" :alt="news.title" />
        </div>
        <div class="news-content">
          <h3>{{ news.title }}</h3>
          <p class="news-date">{{ news.date }}</p>
          <p class="news-summary">{{ news.summary }}</p>
          <button class="read-more" @click="readMore(news)">Leer más</button>
        </div>
      </article>
    </section>

    <section v-if="selectedNews" class="news-detail">
      <div class="detail-header">
        <div>
          <span class="detail-label">Detalle seleccionado</span>
          <h2>{{ selectedNews.title }}</h2>
          <p class="detail-date">{{ selectedNews.date }}</p>
        </div>
        <button class="detail-close" @click="closeDetail">Cerrar</button>
      </div>

      <div class="detail-body">
        <div class="detail-image">
          <img :src="selectedNews.image" :alt="selectedNews.title" />
        </div>
        <div class="detail-copy">
          <p>{{ selectedNews.content }}</p>
          <ul>
            <li v-for="(point, index) in selectedNews.highlights" :key="index">{{ point }}</li>
          </ul>
          <p class="detail-extra">{{ selectedNews.extra }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'NewsView',
  data() {
    return {
      selectedNews: null,
      newsList: [
        {
          id: 1,
          title: 'Nuevo proyecto de reforestación en Bahía Verde',
          date: '15 de mayo, 2026',
          summary: 'Hemos iniciado un ambicioso proyecto para plantar 10,000 árboles de mangle en la zona de Bahía Verde.',
          image: require('@/assets/arboles plantados ecosistema.avif'),
          content: 'La campaña de reforestación en Bahía Verde ya está en marcha con el apoyo de comunidades locales y voluntarios. Se instalaron viveros temporales y se creó un plan de monitoreo para asegurar el crecimiento de los nuevos manglares.',
          highlights: [
            '10,000 árboles de mangle en fase inicial',
            'Tres zonas prioritarias de restauración',
            'Módulos de capacitación ambiental para familias locales'
          ],
          extra: 'Con este proyecto buscamos proteger la línea costera, mejorar la calidad del agua y generar nuevos hogares para fauna marina.'
        },
        {
          id: 2,
          title: 'Registro de 50 nuevas especies en nuestros manglares',
          date: '10 de mayo, 2026',
          summary: 'Gracias a nuestros voluntarios, hemos documentado 50 nuevas especies en el ecosistema.',
          image: require('@/assets/especies registradas.avif'),
          content: 'Los equipos de campo han completado un censo detallado que incluye aves, crustáceos, peces y anfibios. Este registro fortalece nuestras bases de datos para proteger la biodiversidad del manglar.',
          highlights: [
            '50 especies nuevas documentadas',
            'Registro fotográfico y geolocalizado',
            'Colaboración con investigadores locales'
          ],
          extra: 'Estos datos permitirán diseñar acciones de conservación adaptadas a las necesidades reales del ecosistema y de las comunidades que lo habitan.'
        },
        {
          id: 3,
          title: 'Avances en la filtración del agua',
          date: '5 de mayo, 2026',
          summary: 'Nuestros proyectos han mejorado significativamente la calidad del agua en las zonas costeras.',
          image: require('@/assets/filtracion del agua.avif'),
          content: 'La implementación de sistemas naturales de filtración y restauración de manglar ha logrado reducir sedimentos y mejorar el oxígeno disuelto en las corrientes cercanas. Estas acciones tienen un efecto directo sobre la salud del litoral.',
          highlights: [
            'Sistema de filtración natural activo',
            'Monitoreo de calidad de agua semanal',
            'Recuperación de zonas costeras sensibles'
          ],
          extra: 'Seguiremos integrando prácticas de bioingeniería para que el agua vuelva más limpia y el manglar recupere su capacidad de almacenamiento natural.'
        }
      ]
    };
  },
  methods: {
    readMore(news) {
      this.selectedNews = news;
      this.$nextTick(() => {
        const detailSection = this.$el.querySelector('.news-detail');
        if (detailSection) {
          detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
    closeDetail() {
      this.selectedNews = null;
    }
  }
};
</script>

<style scoped>
.news-page {
  background: linear-gradient(135deg, #0a1a15 0%, #0f2f27 40%, #1a3330 100%);
  color: #ffffff;
  min-height: 100vh;
  padding: 80px 20px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.news-page::before {
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

.page-header::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -24px;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2ecc71, #58d895);
  box-shadow: 0 0 20px rgba(46, 204, 113, 0.4);
}

.page-header h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff, #58d895);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  font-family: 'Poppins', sans-serif;
}

.page-header p {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 400;
}

.news-list {
  display: grid;
  gap: 32px;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.news-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.news-card::before {
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

.news-card:hover::before {
  transform: scaleX(1);
}

.news-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 70px rgba(46, 204, 113, 0.15);
  border-color: rgba(46, 204, 113, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.news-image {
  position: relative;
  overflow: hidden;
  height: 300px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(52, 152, 219, 0.1));
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.news-card:hover .news-image img {
  transform: scale(1.08);
}

.news-content {
  padding: 32px 28px 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.news-content h3 {
  margin: 0 0 16px;
  font-size: clamp(1.3rem, 3vw, 1.7rem);
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.5px;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.news-date {
  display: inline-flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 14px;
  background: rgba(46, 204, 113, 0.15);
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: 20px;
  color: #58d895;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  width: fit-content;
}

.news-summary {
  margin: 0 0 24px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  flex: 1;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
  width: fit-content;
}

.read-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(46, 204, 113, 0.4);
}

.read-more:active {
  transform: translateY(0);
}

.news-detail {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.detail-label {
  display: inline-block;
  margin-bottom: 12px;
  color: #58d895;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.detail-header h2 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin: 0;
  color: #ffffff;
  font-weight: 900;
  letter-spacing: -1px;
  font-family: 'Poppins', sans-serif;
}

.detail-date {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
  margin-top: 8px;
}

.detail-close {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  white-space: nowrap;
}

.detail-close:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #2ecc71;
  color: #2ecc71;
}

.detail-body {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px;
  align-items: start;
}

.detail-image {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  min-height: 400px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(52, 152, 219, 0.1));
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.detail-image:hover img {
  transform: scale(1.05);
}

.detail-copy {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-copy p {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  font-size: 0.95rem;
}

.detail-copy ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-copy li {
  position: relative;
  padding-left: 28px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;
}

.detail-copy li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: #2ecc71;
  font-weight: 900;
  font-size: 1.1rem;
}

.detail-extra {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  font-size: 0.95rem;
  font-style: italic;
  padding: 20px;
  background: rgba(46, 204, 113, 0.08);
  border-left: 3px solid #2ecc71;
  border-radius: 8px;
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
  .detail-body {
    grid-template-columns: 1fr;
  }

  .detail-image {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .news-page {
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

  .news-list {
    gap: 24px;
    margin-bottom: 40px;
  }

  .news-image {
    height: 240px;
  }

  .news-content {
    padding: 24px 20px;
  }

  .news-detail {
    padding: 30px 20px;
  }

  .detail-header {
    gap: 20px;
    margin-bottom: 30px;
    padding-bottom: 20px;
  }

  .detail-header h2 {
    font-size: 1.8rem;
  }

  .detail-close {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .detail-body {
    gap: 30px;
  }

  .detail-image {
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .news-page {
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

  .news-list {
    gap: 20px;
  }

  .news-image {
    height: 200px;
  }

  .news-content {
    padding: 20px 16px;
  }

  .news-content h3 {
    font-size: 1.2rem;
  }

  .read-more {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
    font-size: 0.9rem;
  }

  .news-detail {
    padding: 20px 16px;
  }

  .detail-header {
    flex-direction: column;
    gap: 15px;
    padding-bottom: 15px;
  }

  .detail-header h2 {
    font-size: 1.5rem;
  }

  .detail-close {
    width: 100%;
    text-align: center;
  }

  .detail-body {
    gap: 20px;
  }

  .detail-image {
    min-height: 200px;
  }

  .detail-copy {
    gap: 15px;
  }

  .detail-copy p,
  .detail-copy li,
  .detail-extra {
    font-size: 0.9rem;
  }
}
</style>
