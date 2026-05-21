<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': scrollY > 50 }">
    <div class="nav-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">EcoManglar</span>
      </router-link>
      <div class="nav-links">
        <router-link to="/ecosistema" class="nav-link">Ecosistema</router-link>
        <router-link to="/voluntariado" class="nav-link">Voluntariado</router-link>
        <router-link :to="{ path: '/', hash: '#impacto' }" class="nav-link">Nuestro Impacto</router-link>
        <router-link to="/proyectos" class="nav-link">Proyectos</router-link>
        <router-link to="/educacion" class="nav-link">Educación</router-link>
        <router-link to="/noticias" class="nav-link">Noticias</router-link>
        <router-link to="/donar" class="nav-btn-main btn-primary">Donar Ahora</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      scrollY: 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  padding: 0 var(--space-lg);
}

.navbar-scrolled {
  background: rgba(15, 47, 39, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  height: 70px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(46, 204, 113, 0.1);
  padding: 0 var(--space-xl);
}

.nav-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2xl);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 800;
  font-size: 1.4rem;
  color: var(--color-white);
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.navbar-scrolled .logo {
  color: var(--color-primary);
  font-size: 1.2rem;
}

.logo-icon {
  font-size: 1.8rem;
  display: inline-flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.logo:hover .logo-icon {
  transform: rotate(20deg) scale(1.1);
}

.logo-text {
  background: linear-gradient(135deg, var(--color-white), rgba(255, 255, 255, 0.8));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-scrolled .logo-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex: 1;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link:hover::after {
  width: 100%;
}

.navbar-scrolled .nav-link {
  color: rgba(248, 251, 250, 0.8);
}

.navbar-scrolled .nav-link:hover {
  color: var(--color-primary);
}

.nav-btn-main {
  margin-left: var(--space-lg) !important;
}

@media (max-width: 768px) {
  .navbar {
    height: 70px;
    padding: 0 var(--space-md);
  }

  .navbar-scrolled {
    padding: 0 var(--space-md);
  }

  .nav-content {
    gap: var(--space-lg);
  }

  .nav-links {
    gap: var(--space-md);
  }

  .nav-link {
    font-size: 0.9rem;
  }

  .logo {
    font-size: 1.2rem;
  }

  .nav-btn-main {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-link {
    display: none;
  }

  .nav-btn-main {
    display: inline-flex !important;
    margin-left: 0 !important;
  }
}
</style>
