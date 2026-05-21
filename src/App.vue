<template>
  <NavBar />
  <router-view />
  <FooterEco />
</template>

<script>
import NavBar from './components/NavBar.vue'
import FooterEco from './components/FooterEco.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    FooterEco
  }
}
</script>

<style>
html, body, #app {
  min-height: 100%;
  margin: 0;
  padding: 0;
  background: #0f2f27;
  color: #f8fbfa;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
</style>