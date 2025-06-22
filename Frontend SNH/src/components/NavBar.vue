<!--
    NavBar.vue

    Este componente renderiza la barra de navegación principal de la aplicación usando v-app-bar de Vuetify.
    Incluye:
        - Un botón para alternar el drawer de navegación a la izquierda.
        - Un logo centrado que enlaza a la página de inicio.
        - Un botón para alternar el modo oscuro a la derecha.
        - Divisores verticales para separación visual.
        - Diseño responsivo usando utilidades flex y spacers.

    Props:
        Ninguna

    Emits:
        - 'toggle-drawer': Se emite cuando se hace clic en el icono del drawer de navegación.

    Slots:
        Ninguno

    Dependencias:
        - Componentes de Vuetify: v-app-bar, v-app-bar-nav-icon, v-divider, v-spacer, v-btn, v-icon
        - RouterLink de vue-router para navegación
        - Asset SVG del Logo
        - Componente DarkModeToggle para cambiar el tema

    Uso:
        <NavBar @toggle-drawer="drawer = !drawer" />
-->
<template>
    <v-app-bar color="primary" dark app>
    <!-- Izquierda: Drawer -->
    <div class="d-flex align-center">
        <v-app-bar-nav-icon class="ma-1" @click="$emit('toggle-drawer')" />
    </div>
    <v-divider vertical></v-divider>
    <!-- Spacer para empujar el logo al centro -->
    <v-spacer />
    <!-- Centro: Logo -->
    <RouterLink to="/home" class="text-decoration-none" style="all: unset; cursor: pointer;">
        <div class="d-flex align-center">
            <Logo width="100"/>
        </div>
    </RouterLink>
    <!-- Spacer para empujar los botones a la derecha -->
    <v-spacer />
    <v-divider vertical></v-divider>
    <!-- Derecha: Iconos -->
    <div class="d-flex align-center">
        <v-divider vertical></v-divider>
        <!-- <v-btn class="ma-1" icon to="/dosis-aplicada">
            <v-icon>mdi-needle</v-icon>
        </v-btn> -->
        <v-divider vertical></v-divider>
        <darkMode class="ma-1"/>
        </div>
    </v-app-bar>
</template>

<script setup>
import Logo from "@/assets/logo.svg";
import darkMode from "@/components/DarkModeToggle.vue"
</script>