<template>
  <div class="resource-page">
    <button @click="$router.back()" class="back-btn">← Volver</button>
    <div class="content-card">
      <h1>Manual de Reforestación</h1>
      <p class="intro">Pasos para restaurar nuestras costas de forma efectiva.</p>

      <div class="steps-container">
        <div class="step" v-for="(step, i) in pasos" :key="i">
          <div class="step-num">{{ i + 1 }}</div>
          <div class="step-content">
            <h3>{{ step.titulo }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pasos: [
        { titulo: 'Recolección de Propágulos', desc: 'Identificar semillas sanas de mangle rojo caídas naturalmente.' },
        { titulo: 'Vivero Temporal', desc: 'Mantener las semillas en agua salobre controlada por 2 semanas.' },
        { titulo: 'Siembra Directa', desc: 'Enterrar 1/3 del propágulo en sustrato fangoso durante marea baja.' }
      ]
    }
  }
}
</script>

<style scoped>
.resource-page { background: #061a13; min-height: 100vh; padding: 40px 20px; color: white; }
.content-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 30px; padding: 40px; max-width: 800px; margin: 0 auto; }
.steps-container { margin-top: 40px; }
.step { display: flex; gap: 20px; margin-bottom: 30px; align-items: flex-start; }
.step-num { background: #e8f544; color: #061a13; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-weight: 900; flex-shrink: 0; }
.step-content h3 { color: #fff; margin: 0 0 5px 0; }
.step-content p { color: #d1e2d3; margin: 0; }
</style>