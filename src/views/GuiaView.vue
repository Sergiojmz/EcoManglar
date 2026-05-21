<template>
  <div class="resource-page">
    <button @click="$router.back()" class="back-btn">← Volver</button>
    <article class="content-card">
      <header class="resource-header">
        <span class="tag">Educación Ambiental</span>
        <h1>Guía Básica del Manglar</h1>
        <p>Entendiendo el ecosistema más resiliente de Santa Marta.</p>
      </header>

      <section class="body-text">
        <h2>¿Qué es un manglar?</h2>
        <p>Los manglares son biomas formados por árboles muy tolerantes a la sal que ocupan la zona intermareal cercana a las desembocaduras de cursos de agua dulce.</p>
        
        <div class="info-grid">
          <div class="info-item">
            <h3>Mangle Rojo</h3>
            <p>Se encuentra en la zona más externa, sus raíces parecen zancos.</p>
          </div>
          <div class="info-item">
            <h3>Mangle Negro</h3>
            <p>Posee neumatóforos que le permiten respirar en suelos sin oxígeno.</p>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
.resource-page { background: #061a13; min-height: 100vh; padding: 40px 20px; color: white; }
.back-btn { background: none; border: 1px solid #1f6f2a; color: #e8f544; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin-bottom: 20px; }
.content-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 30px; padding: 40px; max-width: 800px; margin: 0 auto; }
.tag { color: #e8f544; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
h1 { font-size: 2.5rem; margin: 10px 0; background: linear-gradient(to right, #fff, #a2bca5); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; }
.info-item { background: rgba(0,0,0,0.2); padding: 20px; border-radius: 15px; border-left: 4px solid #1f6f2a; }
</style>