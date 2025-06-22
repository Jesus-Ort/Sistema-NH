<!--
    DarkModeToggle.vue

    Un componente de Vue que proporciona un botón para alternar entre el modo oscuro y claro.
    - Muestra un icono de sol (mdi-weather-sunny) cuando está en modo oscuro, indicando el cambio a modo claro.
    - Muestra un icono de luna (mdi-weather-night) cuando está en modo claro, indicando el cambio a modo oscuro.
    - El tooltip/título se actualiza dinámicamente según el modo actual.
    - Utiliza el composable `useDarkMode` para la gestión del estado y la funcionalidad de alternancia.

    Uso:
        <DarkModeToggle />

    Dependencias:
        - Componentes v-btn y v-icon de Vuetify.
        - Un composable personalizado ubicado en '@/composables/useDarkMode'.
-->
<template>
    <v-btn icon @click="toggleDark" :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
</template>

<script setup>
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>