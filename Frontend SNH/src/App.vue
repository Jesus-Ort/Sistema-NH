<template>
  <RouterView/>
  <template>
  <v-app>
    <router-view />

    <!-- Snackbar global -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.message }}

      <template #actions>
        <template v-for="(action, index) in snackbar.actions" :key="index">
          <v-btn color="white" @click="() => handleAction(action)">
            {{ action.text }}
          </v-btn>
        </template>
        <v-btn color="white" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
</template>

<script setup>
import { inject } from 'vue'

const snackbar = inject('snackbarRef')

function handleAction(action) {
  if (typeof action.onClick === 'function') {
    action.onClick()
  }
  snackbar.value.show = false
}
</script>

<style scoped>
</style>
