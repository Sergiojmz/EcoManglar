<template>
  <header class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>
    <div class="hero-content animate-fade-in-up">
      <span class="badge-eco">🌍 Santa Marta, Colombia</span>
      <h1 class="hero-title">
        Guardianes del 
        <br>
        <span class="text-gradient">Ecosistema</span>
      </h1>
      <p class="hero-description">
        Los manglares son los pulmones de nuestras costas. Ayúdanos a proteger el corazón verde de la ciudad del avance de la erosión.
      </p>
      <div class="hero-btns">
        <button class="btn-primary btn-lg" @click="$emit('apoyar')">
          <span>🌱</span>
          Apoyar Ahora
        </button>
        <button class="btn-secondary btn-lg" @click="$emit('scrollDown')">
          <span>↓</span>
          Conocer más
        </button>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">1.2M</span>
          <span class="stat-label">Árboles plantados</span>
        </div>
        <div class="stat">
          <span class="stat-number">45ha</span>
          <span class="stat-label">Protegidas</span>
        </div>
        <div class="stat">
          <span class="stat-number">500+</span>
          <span class="stat-label">Voluntarios</span>
        </div>
      </div>
    </div>
    <div class="scroll-indicator" @click="$emit('scrollDown')">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HomeHero'
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 140px 40px 100px;
  overflow: hidden;
  background: linear-gradient(135deg, #0a1a15 0%, #0f2f27 35%, #1a3330 100%);
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(46, 204, 113, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 85% 85%, rgba(88, 216, 149, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% -10%, rgba(46, 204, 113, 0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 100%);
  z-index: 1;
}

.hero-animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.blob {
  position: absolute;
  opacity: 0.08;
  mix-blend-mode: screen;
  border-radius: 50%;
  filter: blur(120px);
  animation: float 10s ease-in-out infinite;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: #2ecc71;
  top: -200px;
  left: -150px;
  animation-delay: 0s;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: #58d895;
  bottom: -150px;
  right: -100px;
  animation-delay: 2.5s;
}

.blob-3 {
  width: 550px;
  height: 550px;
  background: #2ecc71;
  top: 30%;
  right: -50px;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
  }
  50% {
    transform: translateY(50px) translateX(-30px) scale(1.05);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 950px;
  animation: fadeInUp 0.9s ease-out;
}

.badge-eco {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(46, 204, 113, 0.15);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(46, 204, 113, 0.35);
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 35px;
  animation: slideInDown 0.7s ease-out;
  box-shadow: 0 10px 40px rgba(46, 204, 113, 0.1);
  transition: all 0.3s ease;
}

.badge-eco:hover {
  background: rgba(46, 204, 113, 0.2);
  border-color: rgba(46, 204, 113, 0.5);
  box-shadow: 0 12px 50px rgba(46, 204, 113, 0.15);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: clamp(2.8rem, 8vw, 5rem);
  font-weight: 950;
  line-height: 1.15;
  margin: 30px 0 35px;
  letter-spacing: -1.2px;
  font-family: 'Poppins', sans-serif;
  animation: slideInUp 0.8s ease-out 0.1s backwards;
}

.text-gradient {
  background: linear-gradient(135deg, #58d895 0%, #2ecc71 50%, #1abc9c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  animation: shimmer 3s ease-in-out infinite;
  filter: drop-shadow(0 0 25px rgba(88, 216, 149, 0.35));
}

@keyframes shimmer {
  0%, 100% {
    filter: brightness(1) drop-shadow(0 0 25px rgba(88, 216, 149, 0.35));
  }
  50% {
    filter: brightness(1.15) drop-shadow(0 0 35px rgba(88, 216, 149, 0.5));
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-description {
  font-size: clamp(0.95rem, 2vw, 1.15rem);
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.82);
  margin: 0 auto 50px;
  max-width: 800px;
  animation: fadeIn 0.8s ease-out 0.2s backwards;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.hero-btns {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 80px;
  animation: fadeIn 0.8s ease-out 0.4s backwards;
}

.hero-btns button {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 800;
  padding: 18px 48px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.5px;
}

.hero-btns button span {
  font-size: 1.4rem;
}

.hero-btns .btn-primary {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  box-shadow: 0 15px 40px rgba(46, 204, 113, 0.35);
}

.hero-btns .btn-primary:hover {
  transform: translateY(-4px) scale(1.06);
  box-shadow: 0 25px 60px rgba(46, 204, 113, 0.45);
}

.hero-btns .btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.25);
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.hero-btns .btn-secondary:hover {
  background: rgba(46, 204, 113, 0.18);
  border-color: #2ecc71;
  color: #58d895;
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(46, 204, 113, 0.25);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  animation: fadeIn 0.8s ease-out 0.6s backwards;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(46, 204, 113, 0.1);
  transition: all 0.3s ease;
}

.stat:hover {
  background: rgba(46, 204, 113, 0.08);
  border-color: rgba(46, 204, 113, 0.2);
  transform: translateY(-4px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 950;
  background: linear-gradient(135deg, #58d895, #2ecc71);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Poppins', sans-serif;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.scroll-indicator {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  cursor: pointer;
  animation: bounce 2.5s infinite;
  transition: all 0.3s ease;
}

.scroll-indicator:hover {
  transform: translateX(-50%) scale(1.1);
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(16px);
  }
}

.mouse {
  width: 32px;
  height: 48px;
  border: 2.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  padding-top: 12px;
  transition: all 0.4s ease;
}

.scroll-indicator:hover .mouse {
  border-color: #2ecc71;
  box-shadow: 0 0 25px rgba(46, 204, 113, 0.35);
}

.wheel {
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  animation: scroll 2s infinite;
}

.scroll-indicator:hover .wheel {
  background: #2ecc71;
}

@keyframes scroll {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

@media (max-width: 1024px) {
  .hero {
    padding: 120px 30px 80px;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .hero-stats {
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 24px 70px;
    min-height: 85vh;
  }

  .blob-1 {
    width: 350px;
    height: 350px;
    top: -120px;
    left: -120px;
  }

  .blob-2 {
    width: 300px;
    height: 300px;
    bottom: -120px;
    right: -80px;
  }

  .blob-3 {
    width: 320px;
    height: 320px;
  }

  .hero-title {
    font-size: 2.5rem;
    margin: 20px 0 25px;
  }

  .hero-description {
    font-size: 1rem;
    margin-bottom: 35px;
  }

  .hero-btns {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .hero-btns button {
    width: 100%;
    max-width: 320px;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-top: 40px;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .scroll-indicator {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 80px 16px 60px;
    min-height: 90vh;
  }

  .blob-1 {
    width: 250px;
    height: 250px;
    top: -80px;
    left: -80px;
  }

  .blob-2 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    right: -60px;
  }

  .blob-3 {
    width: 220px;
    height: 220px;
    right: -40px;
  }

  .badge-eco {
    font-size: 0.7rem;
    padding: 10px 24px;
    margin-bottom: 25px;
  }

  .hero-title {
    font-size: 1.8rem;
    margin: 15px 0 20px;
    line-height: 1.2;
  }

  .hero-description {
    font-size: 0.9rem;
    margin-bottom: 25px;
    line-height: 1.7;
  }

  .hero-btns {
    gap: 12px;
    margin-bottom: 50px;
    flex-direction: column;
  }

  .hero-btns button {
    width: 100%;
    max-width: none;
    font-size: 0.9rem;
    padding: 14px 32px;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 35px;
  }

  .stat {
    padding: 14px;
    border-radius: 12px;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .scroll-indicator {
    bottom: 30px;
  }

  .mouse {
    width: 28px;
    height: 42px;
  }
}
</style>
