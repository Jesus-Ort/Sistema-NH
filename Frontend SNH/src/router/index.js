import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import ReportesPage from '@/pages/ReportesPage.vue'
import RegistroAreaSalud from '@/components/RegistroAreaSalud.vue'
import RegistroDosis from '@/components/RegistroDosis.vue'
import RegistroFabricantes from '@/components/RegistroFabricantes.vue'
import RegistroLotes from '@/components/RegistroLotes.vue'
import RegistroPacientes from '@/components/RegistroPacientes.vue'
import RegistroPais from '@/components/RegistroPais.vue'
import RegistroRoles from '@/components/RegistroRoles.vue'
import RegistroUsuarios from '@/components/RegistroUsuarios.vue'
import RegistroVacunas from '@/components/RegistroVacunas.vue'
import DosisAplicadaPage from '@/pages/DosisAplicadaPage.vue'
import LoginComponent from '@/components/LoginComponent.vue'

const routes = [
  {
    path: '/login',
    component:LoginComponent
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', redirect: 'home' },
      { path: 'home', name: 'Inicio', component: HomePage },
      { path: 'reportes', name: 'Reportes', component: ReportesPage },
      { path: 'registro-area-salud', name: 'Centro de Salud', component: RegistroAreaSalud },
      { path: 'registro-dosis', name: 'Dosis', component: RegistroDosis },
      { path: 'registro-fabricantes', name: 'Fabricantes', component: RegistroFabricantes },
      { path: 'registro-lotes', name: 'Lotes', component: RegistroLotes },
      { path: 'registro-pacientes', name: 'Pacientes', component: RegistroPacientes },
      { path: 'registro-pais', name: 'País', component: RegistroPais },
      { path: 'registro-roles', name: 'Roles', component: RegistroRoles },
      { path: 'registro-usuarios', name: 'Usuarios', component: RegistroUsuarios },
      { path: 'registro-vacunas', name: 'Vacunas', component: RegistroVacunas },
      { path: 'dosis-aplicada', name: 'Dosis Aplicada', component: DosisAplicadaPage },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router