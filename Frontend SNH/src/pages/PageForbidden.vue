<template>
  <v-container class="text-center">
    <h1 class="text-h2 mb-4">403 - Acceso Denegado</h1>
    <p>No tienes permisos para acceder a esta página.</p>
    <v-btn color="primary" @click="$router.push('/inicio')">Ir al Inicio</v-btn>
  </v-container>
</template>