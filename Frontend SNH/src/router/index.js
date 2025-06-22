import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Home from '@/pages/HomePage.vue'
import DosisAplicada from '@/pages/DosisAplicadaPage.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'home', name: 'Home', component: Home },
      { path: 'DosisAplicada', name: 'Dosis Aplicada', component: DosisAplicada },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router