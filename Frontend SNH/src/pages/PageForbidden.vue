<template>
  <v-container class="text-center">
    <h1 class="text-h2 mb-4">403 - Acceso Denegado</h1>
    <p>No tienes permisos para acceder a esta página.</p>
    <v-btn color="primary" @click="inicio">Ir al Inicio</v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const inicio = () => {
  router.push('/inicio')
}
</script>
