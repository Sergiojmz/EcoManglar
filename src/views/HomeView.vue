<template>
  <div class="container">
    <nav class="navbar" :class="{ 'navbar-scrolled': scroll.y > 50 }">
      <div class="nav-content">
        <router-link to="/" class="logo">🌿 <span>EcoManglar</span></router-link>
        <div class="nav-links">
          <router-link to="/ecosistema">Ecosistema</router-link>
          <router-link to="/voluntariado">Voluntariado</router-link>
          <a href="#impacto">Impacto</a>
          <router-link to="/donar" class="nav-btn-main">Donar</router-link>
        </div>
      </div>
    </nav>

    <header class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content animate-up">
        <span class="badge-eco">Santa Marta, Colombia</span>
        <h1>Guardianes del <br><span class="text-gradient">Ecosistema</span></h1>
        <p>Los manglares son los pulmones de nuestras costas. Ayúdanos a proteger el corazón verde de la ciudad del avance de la erosión.</p>
        <div class="hero-btns">
          <button class="btn-main" @click="apoyar">Apoyar Ahora 🌿</button>
          <button class="btn-sec" @click="scrollDown">Conocer más</button>
        </div>
      </div>
    </header>

    <section class="impact-stats" id="impacto">
      <div class="stats-wrapper">
        <div class="stat-card">
          <div class="stat-val">+1,200</div>
          <div class="stat-lab">Árboles Plantados</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">45ha</div>
          <div class="stat-lab">Área Protegida</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">100%</div>
          <div class="stat-lab">Transparencia</div>
        </div>
      </div>
    </section>

    <section class="section species-section" id="info">
      <div class="container-inner">
        <h2 class="section-title">Vida que depende del Manglar</h2>
        <p class="section-subtitle">Miles de especies dependen de este refugio natural para sobrevivir en nuestras costas.</p>
        <div class="cards-container">
          <div class="info-card" v-for="item in especies" :key="item.nombre">
            <div class="card-icon">{{ item.icon }}</div>
            <h3>{{ item.nombre }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <transition name="fade">
      <section v-if="adminVisible" class="admin-panel">
        <div class="admin-card animate-pop">
          <div class="admin-header">
            <div>
              <h2>Sistema de Gestión Interna</h2>
              <p>Control de aportes y voluntarios - Santa Marta Sostenible</p>
            </div>
            <button class="close-btn" @click="cerrarAdmin">×</button>
          </div>
          
          <div class="stats-grid">
            <div class="stat-item highlight">
              <span>Recaudación Total</span>
              <p class="money">${{ totalRecaudado.toLocaleString() }}</p>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" :style="{ width: progressGoal + '%' }"></div>
              </div>
              <small>{{ progressGoal }}% de la meta (10M)</small>
            </div>
            <div class="stat-item">
              <span>Participación Social</span>
              <p class="stat-number">{{ listaVoluntarios.length }} Voluntarios</p>
              <small>Inscritos para próximas jornadas</small>
            </div>
          </div>

          <div class="admin-tools">
            <div class="admin-tabs">
              <button :class="{ active: tab === 'donaciones' }" @click="tab = 'donaciones'">💰 Donaciones</button>
              <button :class="{ active: tab === 'voluntarios' }" @click="tab = 'voluntarios'">🌱 Voluntarios</button>
            </div>
            <input 
              type="text" 
              v-model="busqueda" 
              placeholder="Buscar en esta lista..." 
              class="search-input"
            >
            <div class="action-btns">
              <button @click="exportarCSV" class="tool-btn csv">📥 Exportar {{ tab === 'donaciones' ? 'CSV' : 'Lista' }}</button>
              <button @click="limpiarHistorial" class="tool-btn delete">🗑️ Limpiar {{ tab === 'donaciones' ? 'DB' : 'Registros' }}</button>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr v-if="tab === 'donaciones'">
                  <th>Referencia</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
                <tr v-else>
                  <th>Nombre</th>
                  <th>Habilidad / Correo</th>
                  <th>Fecha Registro</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="tab === 'donaciones'">
                  <tr v-for="d in donacionesFiltradas" :key="d.referencia">
                    <td class="ref-text">#{{ d.referencia }}</td>
                    <td class="amt-text">${{ Number(d.monto).toLocaleString() }}</td>
                    <td>{{ d.fecha }}</td>
                    <td><span class="status-tag">Completado</span></td>
                  </tr>
                </template>

                <template v-else>
                  <tr v-for="(v, i) in voluntariosFiltrados" :key="i">
                    <td><strong>{{ v.nombre }}</strong></td>
                    <td>{{ v.habilidad }} <br> <small>{{ v.correo }}</small></td>
                    <td>{{ v.fecha }}</td>
                    <td><span class="status-tag active">Inscrito</span></td>
                  </tr>
                </template>

                <tr v-if="(tab === 'donaciones' && donacionesFiltradas.length === 0) || (tab === 'voluntarios' && voluntariosFiltrados.length === 0)">
                  <td colspan="4" class="no-data">No se encontraron registros en esta categoría.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </transition>

    <footer class="footer-eco">
      <div class="footer-content">
        <p class="copyright">
          <span class="secret-trigger" @click="intentarAccesoAdmin">🌿</span> 
          © 2026 Proyecto Santa Marta Sostenible
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scroll: { y: 0 },
      adminVisible: false,
      clicsAdmin: 0,
      busqueda: "",
      tab: 'donaciones', 
      meta: 10000000,
      listaDonaciones: [],
      listaVoluntarios: [],
      claveAcceso: "2026", 
      especies: [
        { nombre: 'Cangrejo Azul', icon: '🦀', desc: 'Ingeniero del suelo que oxigena las raíces al excavar.' },
        { nombre: 'Garza Blanca', icon: '🦩', desc: 'Utiliza las copas altas para anidar y proteger a sus crías.' },
        { nombre: 'Mangle Rojo', icon: '🌳', desc: 'Sus raíces zancudas son el principal escudo contra el oleaje.' },
        { nombre: 'Sábalo', icon: '🐟', desc: 'Utiliza el laberinto de raíces como guardería en sus primeros meses.' }
      ]
    }
  },
  mounted() { window.addEventListener('scroll', this.handleScroll); },
  unmounted() { window.removeEventListener('scroll', this.handleScroll); },
  computed: {
    totalRecaudado() {
      return this.listaDonaciones.reduce((sum, d) => sum + (Number(d.monto) || 0), 0);
    },
    progressGoal() {
      let perc = (this.totalRecaudado / this.meta) * 100;
      return Math.min(perc, 100).toFixed(1);
    },
    donacionesFiltradas() {
      return this.listaDonaciones.filter(d => 
        d.referencia.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    },
    voluntariosFiltrados() {
      return this.listaVoluntarios.filter(v => 
        v.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        v.habilidad.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
  },
  methods: {
    handleScroll() { this.scroll.y = window.scrollY; },
    intentarAccesoAdmin() {
      this.clicsAdmin++;
      setTimeout(() => { this.clicsAdmin = 0; }, 3000);
      if (this.clicsAdmin >= 5) {
        this.clicsAdmin = 0;
        const pass = prompt("ACCESO RESTRINGIDO - CLAVE:");
        if (pass === this.claveAcceso) {
          this.cargarDatosAdmin();
          this.adminVisible = true;
        }
      }
    },
    cargarDatosAdmin() {
      // Cargamos ambos desde localStorage
      const d = localStorage.getItem('donaciones_manglares');
      this.listaDonaciones = d ? JSON.parse(d) : [];
      
      const v = localStorage.getItem('registro_voluntarios');
      this.listaVoluntarios = v ? JSON.parse(v) : [];
    },
    exportarCSV() {
      let data = this.tab === 'donaciones' ? this.listaDonaciones : this.listaVoluntarios;
      if (data.length === 0) return alert("No hay datos para exportar");
      
      let csv = this.tab === 'donaciones' ? "Referencia,Monto,Fecha\n" : "Nombre,Correo,Habilidad,Fecha\n";
      data.forEach(item => {
        csv += this.tab === 'donaciones' 
          ? `${item.referencia},${item.monto},${item.fecha}\n`
          : `${item.nombre},${item.correo},${item.habilidad},${item.fecha}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${this.tab}_2026.csv`;
      a.click();
    },
    limpiarHistorial() {
      const msj = this.tab === 'donaciones' ? "donaciones" : "voluntarios";
      const key = this.tab === 'donaciones' ? 'donaciones_manglares' : 'registro_voluntarios';
      
      if (confirm(`¿Borrar TODA la lista de ${msj}?`)) {
        localStorage.removeItem(key);
        if(this.tab === 'donaciones') this.listaDonaciones = [];
        else this.listaVoluntarios = [];
      }
    },
    cerrarAdmin() { this.adminVisible = false; },
    apoyar() { this.$router.push('/donar'); },
    scrollDown() { document.getElementById('info').scrollIntoView({ behavior: 'smooth' }); }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

.container { font-family: 'Outfit', sans-serif; color: #1a332d; background: #fdfdfd; margin: 0; padding: 0; }

/* NAVBAR */
.navbar { position: fixed; top: 0; width: 100%; height: 80px; display: flex; align-items: center; z-index: 1000; transition: all 0.4s ease; background: rgba(255, 255, 255, 0.1); }
.navbar-scrolled { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(15px); height: 70px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); }
.nav-content { width: 90%; max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.logo { font-weight: 800; font-size: 1.4rem; color: #1b5e20; text-decoration: none; }
.nav-links { display: flex; align-items: center; gap: 30px; }
.nav-links a { text-decoration: none; color: #1b5e20; font-weight: 600; transition: 0.3s; }
.nav-links a:hover { color: #8bc34a; }
.nav-btn-main { background: #1b5e20; color: white !important; padding: 10px 25px; border-radius: 50px; cursor: pointer; font-weight: 800; }

/* HERO */
.hero { position: relative; min-height: 80vh; display: flex; align-items: center; justify-content: center; text-align: center; background: linear-gradient(rgba(0,30,20,0.5), rgba(0,30,20,0.5)), url('https://images.unsplash.com/photo-1544365851-4040a4698544?q=80&w=2000') center/cover; color: white; padding: 100px 20px; }
.hero-content h1 { font-size: 4rem; font-weight: 800; line-height: 1.1; margin: 20px 0; }
.text-gradient { background: linear-gradient(to right, #8bc34a, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.btn-main { background: #8bc34a; color: #05110d; border: none; padding: 15px 35px; border-radius: 50px; font-weight: 800; cursor: pointer; }
.btn-sec { background: white; color: #1b5e20; border: none; padding: 15px 35px; border-radius: 50px; font-weight: 800; cursor: pointer; margin-left: 10px; }

/* STATS */
.impact-stats { margin-top: -60px; position: relative; z-index: 10; padding: 0 20px; }
.stats-wrapper { display: flex; justify-content: center; gap: 25px; max-width: 1100px; margin: 0 auto; }
.stat-card { background: white; flex: 1; padding: 35px; border-radius: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); text-align: center; border: 1px solid #f0f0f0; }
.stat-val { font-size: 2.2rem; font-weight: 800; color: #1b5e20; display: block; }

/* ESPECIES */
.species-section { padding: 100px 20px; text-align: center; }
.cards-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
.info-card { background: white; padding: 40px; border-radius: 30px; transition: 0.4s; border: 1px solid #f0f0f0; }

/* ADMIN UI - NUEVOS ESTILOS */
.admin-panel { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,20,15,0.85); backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
.admin-card { background: white; border-radius: 35px; width: 100%; max-width: 900px; max-height: 85vh; padding: 40px; overflow-y: auto; }

.admin-tabs { display: flex; gap: 10px; margin-bottom: 15px; }
.admin-tabs button { padding: 10px 20px; border-radius: 12px; border: 1px solid #eee; background: #f9f9f9; cursor: pointer; font-weight: 600; transition: 0.3s; }
.admin-tabs button.active { background: #1b5e20; color: white; border-color: #1b5e20; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
.stat-item { background: #f9fbf9; padding: 20px; border-radius: 20px; border: 1px solid #edf2ef; }
.stat-item.highlight { background: #e8f5e9; }
.money { font-size: 2rem; font-weight: 800; color: #2e7d32; }

.progress-bar-bg { background: #ddd; height: 8px; border-radius: 10px; margin: 10px 0; overflow: hidden; }
.progress-bar-fill { background: #8bc34a; height: 100%; transition: 0.5s; }

.search-input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #ddd; margin-bottom: 15px; }
.action-btns { display: flex; gap: 10px; }
.tool-btn { padding: 10px 15px; border-radius: 10px; border: none; cursor: pointer; font-weight: 600; }
.tool-btn.csv { background: #e3f2fd; color: #1565c0; }
.tool-btn.delete { background: #ffebee; color: #c62828; }

.table-container { border: 1px solid #eee; border-radius: 15px; overflow: hidden; margin-top: 10px; }
table { width: 100%; border-collapse: collapse; }
th { background: #f8faf8; padding: 15px; text-align: left; color: #1b5e20; font-size: 0.8rem; }
td { padding: 15px; border-bottom: 1px solid #f5f5f5; font-size: 0.9rem; }
.status-tag { padding: 4px 10px; border-radius: 20px; background: #e8f5e9; color: #2e7d32; font-size: 0.75rem; font-weight: 700; }

.footer-eco { background: #05110d; color: #888; padding: 40px; text-align: center; }
.secret-trigger { cursor: pointer; }

.fade-enter-active { transition: opacity 0.4s; }
.fade-enter-from { opacity: 0; }
</style>