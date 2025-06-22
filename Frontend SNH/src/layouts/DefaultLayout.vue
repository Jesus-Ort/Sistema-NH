<template>
  <v-app>
    <NavBar @toggle-drawer="drawer = !drawer"/>

    <v-navigation-drawer app v-model="drawer">
      <v-list nav dense>
        <v-list-item
          v-for="item in drawerItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          link
        >
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
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
  { label: 'Inicio', icon: 'mdi-home', to: '/home', roles: ['administrativo', 'salud'] },
  { label: 'Pacientes', icon: 'mdi-account-group', to: '/pacientes', roles: ['salud'] },
  { label: 'Vacunas', icon: 'mdi-needle', to: '/vacunas', roles: ['salud'] },
  { label: 'Usuarios', icon: 'mdi-account-cog', to: '/usuarios', roles: ['administrativo'] },
  { label: 'Reportes', icon: 'mdi-file-chart', to: '/reportes', roles: ['administrativo'] },
  { label: 'Perfil', icon: 'mdi-account', to: '/perfil', roles: ['administrativo', 'salud'] },
]

const drawerItems = computed(() =>
  allDrawerItems.filter(item => item.roles.includes(userRole.value))
)
</script>