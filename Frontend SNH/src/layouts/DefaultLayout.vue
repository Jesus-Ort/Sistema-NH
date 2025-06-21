<template>
  <v-app>
    <NavBar @toggle-drawer="drawer = !drawer"/>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list nav>
        <v-list-item link to="/home">
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/pacientes">
          <v-list-item-title>Pacientes</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/vacunas">
          <v-list-item-title>Vacunas</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="pa-4 mt-15">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'

const drawer = ref(false)
</script>