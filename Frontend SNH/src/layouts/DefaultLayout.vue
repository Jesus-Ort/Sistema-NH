<template>
  <v-app>
    <NavBar @toggle-drawer="drawer = !drawer"/>

    <v-navigation-drawer app v-model="drawer">
        <v-list nav dense>
            <template v-for="section in drawerItems" :key="section.title || 'inicio'">
              <template v-if="section.title">
                <v-divider class="my-2" />
                <v-list-subheader class="text-uppercase">
                  {{ section.title }}
                </v-list-subheader>
              </template>
              <v-list-item
                v-for="item in section.items"
                :key="item.to"
                :to="item.to"
                :prepend-icon="item.icon"
                link
              >
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>

    <v-main class="pa-4 mt-15">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'

const drawer = ref(false)
const userRole = ref('administrativo') // Sacar del Backend.

const allDrawerItems = [
  {
    title: null,
    items: [
      { label: 'Inicio', icon: 'mdi-home', to: '/home', roles: ['administrativo', 'salud'] },
      { label: 'Reportes', icon: 'mdi-file-chart', to: '/reportes', roles: ['administrativo'] },
    ],
  },
  {
    title: 'Registro Administrativo',
    items: [
      { label: 'Registrar Centro de Salud', icon: 'mdi-hospital-building', to: '/registro-area-salud', roles: ['administrativo'] },
      { label: 'Registrar Dosis', icon: 'mdi-hospital', to: '/registro-dosis', roles: ['administrativo'] },
      { label: 'Registrar Fabricante', icon: 'mdi-factory', to: '/registro-fabricantes', roles: ['administrativo'] },
      { label: 'Registrar Lote', icon: 'mdi-package', to: '/registro-lotes', roles: ['administrativo'] },
      { label: 'Registrar Paciente', icon: 'mdi-account-group', to: '/registro-pacientes', roles: ['administrativo'] },
      { label: 'Registrar País', icon: 'mdi-earth', to: '/registro-pais', roles: ['administrativo'] },
      { label: 'Registrar Rol', icon: 'mdi-account-key', to: '/registro-roles', roles: ['administrativo'] },
      { label: 'Registrar Usuario', icon: 'mdi-account-cog', to: '/registro-usuarios', roles: ['administrativo'] },
      { label: 'Registrar Vacuna', icon: 'mdi-needle', to: '/registro-vacunas', roles: ['administrativo'] },
    ],
  },
    {
    title: "Formularios",
    items: [
      { label: 'Dosis Aplicada', icon: 'mdi-hospital', to: '/dosis-aplicada', roles: ['administrativo', 'salud'] },
    ],
  },
]

const drawerItems = computed(() =>
  allDrawerItems
    .map(section => {
      const filteredItems = section.items.filter(i => i.roles.includes(userRole.value))
      return {
        title: section.title,
        items: filteredItems,
      }
    })
    .filter(section => section.items.length > 0)
)
</script>