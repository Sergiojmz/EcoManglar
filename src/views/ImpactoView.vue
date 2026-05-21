<template>
  <div class="resource-page">
    <button @click="$router.back()" class="back-btn">← Volver</button>
    <div class="content-card">
      <h1>Informe de Impacto 2025</h1>
      
      <div class="impact-stats">
        <div class="stat-box">
          <span class="value">{{ porcentaje }}%</span>
          <span class="label">Meta Financiera</span>
        </div>
        <div class="stat-box">
          <span class="value">1,240</span>
          <span class="label">Árboles Plantados</span>
        </div>
      </div>

      <div class="chart-mock">
        <div class="bar-label">Progreso hacia los 100M COP</div>
        <div class="bar-bg">
          <div class="bar-fill" :style="{ width: porcentaje + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    porcentaje() {
      const historial = JSON.parse(localStorage.getItem('historial_donaciones') || '[]');
      const total = historial.reduce((s, d) => s + Number(d.monto), 0) + 7550000;
      return Math.min(((total / 100000000) * 100).toFixed(1), 100);
    }
  }
}
</script>

<style scoped>
.resource-page { background: #061a13; min-height: 100vh; padding: 40px 20px; color: white; }
.content-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 30px; padding: 40px; max-width: 800px; margin: 0 auto; text-align: center; }
.impact-stats { display: flex; justify-content: space-around; margin: 40px 0; }
.stat-box .value { display: block; font-size: 2.5rem; font-weight: 800; color: #e8f544; }
.stat-box .label { color: #d1e2d3; font-size: 0.9rem; }
.bar-bg { background: rgba(255,255,255,0.1); height: 20px; border-radius: 10px; margin-top: 10px; overflow: hidden; }
.bar-fill { background: #1f6f2a; height: 100%; transition: width 1s ease-out; }
</style>