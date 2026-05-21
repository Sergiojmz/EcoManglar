import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DonarView from '../views/DonarView.vue'
import VoluntariadoView from '../views/VoluntariadoView.vue'
import EcosistemaView from '../views/EcosistemaView.vue'

const routes = [
    { path: '/', name: 'inicio', component: HomeView },
    { path: '/noticias', name: 'noticias', component: () => import('@/views/NewsView.vue') },
    { path: '/donar', name: 'donar', component: DonarView },
    { path: '/voluntariado', name: 'voluntariado', component: VoluntariadoView },
    { path: '/ecosistema', name: 'ecosistema', component: EcosistemaView },
    { path: '/proyectos', name: 'proyectos', component: () => import('@/views/ProyectosView.vue') },
    { path: '/educacion', name: 'educacion', component: () => import('@/views/EducacionView.vue') },
    { path: '/educacion/guia', name: 'guia-manglar', component: () => import('@/views/GuiaView.vue') },
    { path: '/educacion/manual', name: 'manual-reforestacion', component: () => import('@/views/ManualView.vue') },
    { path: '/educacion/impacto', name: 'informe-impacto', component: () => import('@/views/ImpactoView.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        if (to.hash) return { el: to.hash, behavior: 'smooth' }
        return { top: 0 }
    }
})

export default router