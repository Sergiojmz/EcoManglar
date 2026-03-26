<template>
  <div class="view-container animate-fade-in">
    <header class="view-header">
      <h1 class="text-gradient">Nuestra Riqueza Natural</h1>
      <p>Explora cómo el manglar protege a Santa Marta y al mundo.</p>
    </header>

    <div class="content-grid">
      <div class="info-card-premium" v-for="(info, index) in detalles" :key="index">
        <span class="number-badge">{{ index + 1 }}</span>
        <h3>{{ info.titulo }}</h3>
        <p>{{ info.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EcosistemaView',
  data() {
    return {
      detalles: [
        { titulo: 'Filtro de Agua', descripcion: 'Las raíces filtran sedimentos y contaminantes antes de que lleguen al mar.' },
        { titulo: 'Barrera Natural', descripcion: 'Protegen las costas de Santa Marta contra la erosión y tormentas.' },
        { titulo: 'Cuna de Vida', descripcion: 'Hogar temporal de especies comerciales y protegidas del Caribe.' }
      ]
    }
  }
}
</script>

<style scoped>
.view-container {
  min-height: 100vh;
  padding: 120px 20px 60px; /* Padding superior para que no lo tape el Navbar */
  background: #0a1f1a; /* El mismo fondo oscuro de Donar */
  color: white;
}

.view-header { text-align: center; margin-bottom: 50px; }

.text-gradient {
  background: linear-gradient(90deg, #8bc34a, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 800;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card-premium {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 20px;
  position: relative;
  transition: 0.3s;
}

.info-card-premium:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-5px);
}

.number-badge {
  color: #8bc34a;
  font-weight: 800;
  font-size: 1.2rem;
  display: block;
  margin-bottom: 10px;
}
</style>