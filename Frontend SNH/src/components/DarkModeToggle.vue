<template>
    <v-btn icon @click="toggleDarkMode" :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = ref(theme.global.current.value.dark)

// Sincronizar `isDark` si el tema cambia externamente
watchEffect(() => {
    isDark.value = theme.global.current.value.dark
})

function toggleDarkMode() {
    theme.global.name.value = isDark.value ? 'SNH' : 'SNHdark'
    isDark.value = !isDark.value
}
</script>
