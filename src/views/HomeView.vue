<template>
  <div class="container">
    <HomeHero @apoyar="apoyar" @scrollDown="scrollDown" />

    <HomeStats />

    <AdminPanel
      v-if="adminVisible"
      :tab="tab"
      :busqueda="busqueda"
      :lista-donaciones="listaDonaciones"
      :lista-voluntarios="listaVoluntarios"
      :total-recaudado="totalRecaudado"
      :progress-goal="progressGoal"
      @update:tab="tab = $event"
      @update:busqueda="busqueda = $event"
      @close="cerrarAdmin"
      @exportCSV="exportarCSV"
      @realizarRetiro="realizarRetiro"
      @eliminarVoluntario="eliminarVoluntario"
      @eliminarTransaccion="eliminarTransaccion"
    />
  </div>
</template>

<script>
import HomeHero from '@/components/HomeHero.vue'
import HomeStats from '@/components/HomeStats.vue'
import AdminPanel from '@/components/AdminPanel.vue'
import api from '@/api'

export default {
  name: 'HomeView',
  components: {
    HomeHero,
    HomeStats,
    AdminPanel
  },
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
      claveAcceso: "2026"
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('secret-admin-trigger', this.intentarAccesoAdmin);
    this.cargarDatosIniciales();
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('secret-admin-trigger', this.intentarAccesoAdmin);
  },
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
    voluntariosFiltradas() {
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
        const pass = prompt('ACCESO RESTRINGIDO - CLAVE:');
        if (pass === this.claveAcceso) {
          this.cargarDatosAdmin();
          this.adminVisible = true;
        }
      }
    },
    cargarDatosAdmin() {
      const d = localStorage.getItem('donaciones_manglares');
      this.listaDonaciones = d ? JSON.parse(d) : [];
      const v = localStorage.getItem('registro_voluntarios');
      this.listaVoluntarios = v ? JSON.parse(v) : [];
    },
    exportarCSV() {
      let data = this.tab === 'donaciones'
        ? this.listaDonaciones.filter(item => item.visible !== false)
        : this.listaVoluntarios;
      if (data.length === 0) return alert('No hay datos para exportar');
      let csv = this.tab === 'donaciones' ? 'Referencia,Monto,Fecha,Tipo\n' : 'Nombre,Correo,Habilidad,Fecha\n';
      data.forEach(item => {
        csv += this.tab === 'donaciones'
          ? `${item.referencia},${item.monto},${item.fecha},${item.tipo || 'donacion'}\n`
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
      const msj = this.tab === 'donaciones' ? 'donaciones' : 'voluntarios';
      const key = this.tab === 'donaciones' ? 'donaciones_manglares' : 'registro_voluntarios';
      if (confirm(`¿Borrar TODA la lista de ${msj}?`)) {
        localStorage.removeItem(key);
        if (this.tab === 'donaciones') this.listaDonaciones = [];
        else this.listaVoluntarios = [];
      }
    },
    async cargarDatosIniciales() {
      try {
        const [donaciones, voluntarios] = await Promise.all([
          api.get('/donations'),
          api.get('/volunteers')
        ]);
        this.listaDonaciones = donaciones;
        this.listaVoluntarios = voluntarios;
        localStorage.setItem('donaciones_manglares', JSON.stringify(donaciones));
        localStorage.setItem('registro_voluntarios', JSON.stringify(voluntarios));
      } catch (error) {
        console.warn('No se pudo cargar datos desde el backend, se usa localStorage.', error);
        this.cargarDatosAdmin();
      }
    },
    realizarRetiro(payload) {
      if (!payload || !payload.amount || payload.amount <= 0) {
        return alert('Monto inválido para retiro.');
      }

      const total = this.totalRecaudado;
      if (payload.amount > total) {
        return alert('El monto de retiro supera el saldo disponible.');
      }

      if (!payload.paymentInfo) {
        return alert('Debes ingresar los datos de pago.');
      }

      const pregunta = `Retirar $${payload.amount.toLocaleString()} COP usando ${payload.method.toUpperCase()} (${payload.paymentInfo})?`;
      if (!confirm(pregunta)) {
        return alert('Operación de retiro cancelada.');
      }

      const nuevaRetiro = this.crearRegistroRetiro(payload.amount, payload.method, payload.paymentInfo);
      this.listaDonaciones = [nuevaRetiro, ...this.listaDonaciones];
      localStorage.setItem('donaciones_manglares', JSON.stringify(this.listaDonaciones));

      alert(`Retiro realizado. Se registró una transferencia de $${payload.amount.toLocaleString()} COP.`);
    },
    crearRegistroRetiro(monto, metodo, paymentInfo) {
      const fecha = new Date().toLocaleString();
      return {
        referencia: `RETIRO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        monto: -Math.abs(Number(monto)),
        fecha,
        metodo,
        paymentInfo,
        tipo: 'retiro'
      };
    },
    eliminarVoluntario(voluntario) {
      if (!voluntario) return;
      const confirmDelete = confirm(`¿Eliminar al voluntario ${voluntario.nombre}?`);
      if (!confirmDelete) return;

      this.listaVoluntarios = this.listaVoluntarios.filter(v => v.nombre !== voluntario.nombre || v.correo !== voluntario.correo || v.fecha !== voluntario.fecha);
      localStorage.setItem('registro_voluntarios', JSON.stringify(this.listaVoluntarios));
      alert(`Voluntario ${voluntario.nombre} eliminado correctamente.`);
    },
    eliminarTransaccion(transaccion) {
      if (!transaccion || !transaccion.referencia) return;
      const index = this.listaDonaciones.findIndex(item => item.referencia === transaccion.referencia);
      if (index === -1) return;
      const nuevaLista = [...this.listaDonaciones];
      nuevaLista[index] = {
        ...nuevaLista[index],
        visible: false
      };
      this.listaDonaciones = nuevaLista;
      localStorage.setItem('donaciones_manglares', JSON.stringify(this.listaDonaciones));
      alert(`El registro ${transaccion.referencia} se eliminó del historial.`);
    },
    cerrarAdmin() { this.adminVisible = false; },
    apoyar() { this.$router.push('/donar'); },
    scrollDown() { document.getElementById('info').scrollIntoView({ behavior: 'smooth' }); }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

.container { font-family: 'Plus Jakarta Sans', sans-serif; color: #1a332d; background: #f9fbf9; margin: 0; padding: 0; }

.navbar { position: fixed; top: 0; width: 100%; height: 80px; display: flex; align-items: center; z-index: 1000; transition: all 0.4s ease; background: transparent; }
.navbar-scrolled { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); height: 70px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); border-bottom: 1px solid rgba(255,255,255,0.4); }
.nav-content { width: 90%; max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.logo { font-weight: 800; font-size: 1.4rem; color: white; text-decoration: none; }
.navbar-scrolled .logo { color: #1b5e20; }
.nav-links { display: flex; align-items: center; gap: 30px; }
.nav-links a { text-decoration: none; color: rgba(255,255,255,0.9); font-weight: 600; transition: 0.3s; font-size: 0.95rem; }
.nav-links a:hover { color: #ffeb3b; }
.navbar-scrolled .nav-links a { color: #1b5e20; }
.navbar-scrolled .nav-links a:hover { color: #8bc34a; }
.nav-btn-main { background: #ffeb3b; color: #1b5e20 !important; padding: 10px 25px; border-radius: 50px; cursor: pointer; font-weight: 800; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.nav-btn-main:hover { transform: scale(1.1); box-shadow: 0 10px 20px rgba(255, 235, 59, 0.3); }

.hero { 
  position: relative; 
  min-height: 85vh; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  text-align: center; 
  background-image: url('@/assets/fondo-hero.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white; 
  padding: 120px 20px; 
 
  border-radius: 0 0 50px 50px;
}

.hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(0,30,20,0.3) 0%, rgba(0,30,20,0.6) 100%);
  z-index: 1;
  border-radius: 0 0 50px 50px;
}

.hero-content {
  position: relative;
  z-index: 2; 
  max-width: 800px;
}

.badge-eco { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(5px); padding: 7px 18px; border-radius: 20px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; border: 1px solid rgba(255,255,255,0.2); }

.hero-content h1 { font-size: 4rem; font-weight: 800; line-height: 1.1; margin: 25px 0 15px; }
.text-gradient { background: linear-gradient(to right, #8bc34a, #ffffff); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.hero-content p { font-size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.9); margin-bottom: 40px; }

.btn-main { background: #8bc34a; color: #05110d; border: none; padding: 16px 40px; border-radius: 50px; font-weight: 800; cursor: pointer; transition: 0.3s; font-size: 1rem; box-shadow: 0 10px 25px rgba(139, 195, 74, 0.3); }
.btn-main:hover { background: #ffeb3b; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(139, 195, 74, 0.4); }
.btn-sec { background: transparent; color: white; border: 2px solid white; padding: 14px 40px; border-radius: 50px; font-weight: 800; cursor: pointer; margin-left: 15px; transition: 0.3s; font-size: 1rem; }
.btn-sec:hover { background: rgba(255,255,255,0.1); }

.impact-stats { margin-top: -80px; position: relative; z-index: 10; padding: 0 20px; }
.stats-wrapper { display: flex; justify-content: center; gap: 30px; max-width: 1100px; margin: 0 auto; }
.stat-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); flex: 1; padding: 40px; border-radius: 30px; box-shadow: 0 30px 60px rgba(0,0,0,0.08); text-align: center; border: 1px solid rgba(255, 255, 255, 0.5); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.stat-card:hover { transform: translateY(-10px) scale(1.03); box-shadow: 0 40px 80px rgba(0,0,0,0.12); border-color: #8bc34a; }
.stat-val { font-size: 2.8rem; font-weight: 800; color: #1b5e20; display: block; margin-bottom: 5px; }
.stat-lab { font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }

.species-section { padding: 150px 20px; text-align: center; background-color: #f0f4f0; }
.section-title { font-size: 3rem; font-weight: 800; color: #1b5e20; margin-bottom: 15px; }
.section-subtitle { color: #666; margin-bottom: 80px; max-width: 600px; margin-left: auto; margin-right: auto; font-size: 1.1rem; }
.cards-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 40px; max-width: 1200px; margin: 0 auto; }
.info-card { background: white; padding: 50px 40px; border-radius: 35px; transition: 0.4s ease; border: 1px solid #f0f0f0; text-align: left; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
.info-card:hover { transform: translateY(-15px); border-color: #ffeb3b; box-shadow: 0 30px 60px rgba(0,0,0,0.08); }
.card-icon { font-size: 3.5rem; margin-bottom: 30px; display: inline-block; }
.info-card h3 { color: #1b5e20; font-weight: 800; margin-bottom: 15px; font-size: 1.5rem; }
.info-card p { color: #666; line-height: 1.7; font-size: 0.95rem; }

.admin-panel { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,20,15,0.85); backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
.admin-card { background: white; border-radius: 35px; width: 100%; max-width: 900px; max-height: 85vh; padding: 40px; overflow-y: auto; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.close-btn { background: #f0f0f0; border: none; font-size: 1.5rem; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; transition: 0.3s; color: #666; }
.close-btn:hover { background: #e0e0e0; color: #333; }

.admin-tabs { display: flex; gap: 10px; margin-bottom: 15px; }
.admin-tabs button { padding: 10px 20px; border-radius: 12px; border: 1px solid #eee; background: #f9f9f9; cursor: pointer; font-weight: 600; transition: 0.3s; color: #666; }
.admin-tabs button:hover { background: #f0f0f0; }
.admin-tabs button.active { background: #1b5e20; color: white; border-color: #1b5e20; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
.stat-item { background: #f9fbf9; padding: 25px; border-radius: 20px; border: 1px solid #edf2ef; }
.stat-item.highlight { background: #e8f5e9; border-color: #c8e6c9; }
.stat-item span { color: #666; font-size: 0.9rem; }
.money { font-size: 2.5rem; font-weight: 800; color: #2e7d32; margin: 10px 0; }
.stat-number { font-size: 2.5rem; font-weight: 800; color: #1b5e20; margin: 10px 0; }
.stat-item small { color: #888; }

.progress-bar-bg { background: #e0e0e0; height: 10px; border-radius: 10px; margin: 15px 0 8px 0; overflow: hidden; }
.progress-bar-fill { background: linear-gradient(to right, #8bc34a, #2e7d32); height: 100%; transition: 1s cubic-bezier(0.1, 0.7, 1.0, 0.1); border-radius: 10px; }

.search-input { width: 100%; padding: 15px; border-radius: 12px; border: 1px solid #ddd; margin-bottom: 15px; font-family: inherit; font-size: 1rem; }
.search-input:focus { outline: none; border-color: #8bc34a; box-shadow: 0 0 0 3px rgba(139, 195, 74, 0.2); }
.action-btns { display: flex; gap: 10px; margin-bottom: 20px; }
.tool-btn { padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-weight: 600; font-family: inherit; transition: 0.3s; }
.tool-btn.csv { background: #e3f2fd; color: #1565c0; }
.tool-btn.csv:hover { background: #d1e9fc; }
.tool-btn.delete { background: #ffebee; color: #c62828; }
.tool-btn.delete:hover { background: #ffdadf; }

.table-container { border: 1px solid #eee; border-radius: 15px; overflow: hidden; }
table { width: 100%; border-collapse: collapse; min-width: 600px; }
th { background: #f8faf8; padding: 18px; text-align: left; color: #1b5e20; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #eee; }
td { padding: 18px; border-bottom: 1px solid #f5f5f5; font-size: 0.95rem; color: #333; }
.ref-text { font-family: monospace; color: #666; background: #f5f5f5; padding: 4px 8px; border-radius: 4px; }
.amt-text { font-weight: 600; color: #2e7d32; }
.status-tag { padding: 6px 12px; border-radius: 20px; background: #e8f5e9; color: #2e7d32; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
.status-tag.active { background: #e3f2fd; color: #1565c0; }
.no-data { text-align: center; padding: 40px; color: #999; font-style: italic; }

.footer-eco {
  background: #1a332d; 
  color: #f0f4f0;
  padding: 60px 0 20px;
  margin-top: 50px;
  border-radius: 50px 50px 0 0; 
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  padding: 0 20px 40px;
}

.footer-column h4 {
  color: #8bc34a; 
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.branding .footer-logo {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 15px;
}

.branding p {
  line-height: 1.6;
  opacity: 0.8;
  max-width: 300px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column li {
  margin-bottom: 12px;
}

.footer-column a {
  color: #f0f4f0;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: #8bc34a;
}

.contact p,
.footer-column span {
  margin: 0 0 10px;
}

.social-placeholder {
  margin-top: 15px;
  font-size: 0.95rem;
  opacity: 0.8;
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 20px 0 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

footer .copyright {
  margin: 0;
  color: rgba(240,244,240,0.8);
}
</style>
