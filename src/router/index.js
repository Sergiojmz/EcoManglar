import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import DonarView from '../views/DonarView.vue'
import VoluntariadoView from '../views/VoluntariadoView.vue'
import EcosistemaView from '../views/EcosistemaView.vue'

const routes = [
    {
        path: '/',
        name: 'inicio',
        component: HomeView
    },
    {
        path: '/donar',
        name: 'donar',
        component: DonarView
    },
    {
        path: '/voluntariado',
        name: 'voluntariado',
        component: VoluntariadoView
    },
    {
        path: '/ecosistema',
        name: 'ecosistema',
        component: EcosistemaView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router