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