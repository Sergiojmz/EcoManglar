<template>
  <footer class="footer-eco">
    <div class="footer-top">
      <div class="footer-container">
        <div class="footer-column branding">
          <div class="footer-logo">
            <span class="logo-icon">🌿</span>
            <span>EcoManglar</span>
          </div>
          <p class="footer-description">Protegiendo los pulmones costeros de Santa Marta. Únete a la conservación de nuestros ecosistemas estratégicos.</p>
          <div class="footer-badges">
            <span class="badge">🌍 Comprometidos</span>
            <span class="badge">♻️ Sostenibles</span>
            <span class="badge">🤝 Comunitarios</span>
          </div>
        </div>

        <div class="footer-column links">
          <h4>Navegación</h4>
          <ul>
            <li><router-link to="/ecosistema">Ecosistema</router-link></li>
            <li><router-link to="/voluntariado">Voluntariado</router-link></li>
            <li><router-link :to="{ path: '/', hash: '#impacto' }">Nuestro Impacto</router-link></li>
            <li><router-link to="/donar">Donaciones</router-link></li>
            <li><router-link to="/proyectos">Proyectos</router-link></li>
            <li><router-link to="/educacion">Educación</router-link></li>
          </ul>
        </div>

        <div class="footer-column contact">
          <h4>Contacto</h4>
          <div class="contact-info">
            <p><span class="icon">📍</span> Santa Marta, Magdalena</p>
            <p><span class="icon">✉️</span> EcoManglar@gmail.com</p>
            <p>
            <span class="icon">📱</span> 
            <a href="https://wa.me/573046366932" target="_blank" class="whatsapp-link">
            +57 3046366932
            </a>
            </p>
          </div>
          <div class="social-links">
            <a href="#" class="social-icon" title="Facebook">f</a>
            <a href="#" class="social-icon" title="Instagram">📷</a>
            <a href="#" class="social-icon" title="Twitter">𝕏</a>
            <a href="#" class="social-icon" title="LinkedIn">in</a>
          </div>
        </div>

        <div class="footer-column newsletter">
          <h4>Newsletter</h4>
          <p class="small-text">Recibe actualizaciones sobre nuestras iniciativas</p>
          <form class="newsletter-form">
            <input type="email" placeholder="Tu email" required>
            <button type="submit" class="btn-newsletter">Suscribirse</button>
          </form>
        </div>
      </div>
    </div>

    <div class="footer-divider"></div>

    <div class="footer-bottom">
      <div class="footer-content">
        <div class="footer-left">
          <p class="copyright">
            <span class="secret-trigger" @click="triggerAdmin" title="Presiona 5 veces para modo admin">🌿</span>
            © 2026 Proyecto Santa Marta Sostenible. Todos los derechos reservados.
          </p>
        </div>
        <div class="footer-links-bottom">
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos de Servicio</a>
          <a href="#">Sostenibilidad</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterEco',
  methods: {
    triggerAdmin() {
      const event = new CustomEvent('secret-admin-trigger');
      window.dispatchEvent(event);
    }
  }
}
</script>

<style scoped>
.footer-eco {
  background: linear-gradient(135deg, #0a1a15 0%, #1a3330 100%);
  color: #f8fbfa;
  padding: 80px 0 0;
  margin-top: 100px;
  border-top: 1px solid rgba(46, 204, 113, 0.2);
  position: relative;
  overflow: hidden;
}

.footer-eco::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(46, 204, 113, 0.5), transparent);
  pointer-events: none;
}

.footer-top {
  padding: 60px 20px 40px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.5fr 1.3fr;
  gap: 40px;
}

.footer-column {
  animation: fadeInUp 0.6s ease-out backwards;
}

.footer-column:nth-child(2) {
  animation-delay: 0.1s;
}

.footer-column:nth-child(3) {
  animation-delay: 0.2s;
}

.footer-column:nth-child(4) {
  animation-delay: 0.3s;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.4rem;
  color: var(--color-primary);
  margin-bottom: 15px;
}

.logo-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

.footer-description {
  line-height: 1.7;
  opacity: 0.8;
  margin-bottom: 20px;
  font-size: 0.95rem;
  color: rgba(248, 251, 250, 0.7);
}

.footer-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.badge {
  background: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.badge:hover {
  background: rgba(46, 204, 113, 0.2);
  border-color: var(--color-primary);
}

.footer-column h4 {
  color: var(--color-primary);
  margin-bottom: 20px;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column li {
  margin-bottom: 12px;
}

.footer-column a {
  color: rgba(248, 251, 250, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  position: relative;
}

.footer-column a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.footer-column a:hover {
  color: var(--color-primary);
}

.footer-column a:hover::after {
  width: 100%;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(248, 251, 250, 0.7);
  font-size: 0.95rem;
  margin: 0;
}

.contact-info .icon {
  font-size: 1.2rem;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(46, 204, 113, 0.15);
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: 50%;
  color: var(--color-primary);
  font-weight: 700;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: var(--color-primary);
  color: #0a1a15;
  transform: translateY(-3px);
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.newsletter-form input {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
  color: #f8fbfa;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.newsletter-form input::placeholder {
  color: rgba(248, 251, 250, 0.5);
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(46, 204, 113, 0.1);
}

.btn-newsletter {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #0a1a15;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-newsletter:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
}

.small-text {
  font-size: 0.85rem;
  color: rgba(248, 251, 250, 0.6);
  margin: 0 0 15px;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(46, 204, 113, 0.3), transparent);
  margin: 0 20px;
}

.footer-bottom {
  padding: 30px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  flex: 1;
}

.copyright {
  margin: 0;
  color: rgba(248, 251, 250, 0.6);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.secret-trigger {
  cursor: pointer;
  transition: transform 0.3s ease;
  display: inline-block;
}

.secret-trigger:hover {
  transform: scale(1.2) rotate(20deg);
}

.footer-links-bottom {
  display: flex;
  gap: 30px;
}

.footer-links-bottom a {
  color: rgba(248, 251, 250, 0.6);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.footer-links-bottom a:hover {
  color: var(--color-primary);
}

@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .footer-top {
    padding: 40px 20px 30px;
  }

  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .footer-links-bottom {
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
  }

  .footer-column h4 {
    text-align: left;
  }

  .newsletter-form {
    flex-direction: row;
    gap: 8px;
  }

  .newsletter-form input,
  .btn-newsletter {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .footer-eco {
    margin-top: 60px;
  }

  .footer-top {
    padding: 30px 16px 20px;
  }

  .footer-container {
    gap: 20px;
  }

  .footer-column h4 {
    font-size: 1rem;
  }

  .footer-logo {
    font-size: 1.2rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .footer-links-bottom {
    gap: 10px;
    justify-content: space-between;
  }

  .footer-links-bottom a {
    font-size: 0.8rem;
  }
}
</style>
