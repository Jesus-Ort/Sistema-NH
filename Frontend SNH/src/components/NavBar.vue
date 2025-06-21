<template>
    <v-app-bar color="primary" dark app>
    <!-- Izquierda: Drawer -->
    <div class="d-flex align-center">
        <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
    </div>
    <v-divider vertical></v-divider>
    <!-- Spacer para empujar el logo al centro -->
    <v-spacer />
    <!-- Centro: Logo -->
    <div class="d-flex align-center">
        <Logo width="100" />
    </div>
    <!-- Spacer para empujar los botones a la derecha -->
    <v-spacer />
    <v-divider vertical></v-divider>
    <!-- Derecha: Iconos -->
    <div class="d-flex align-center">
        <v-btn class="ma-1" icon to="/home">
            <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn class="ma-1" icon to="/pacientes">
            <v-icon>mdi-account-group</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn class="ma-1" icon to="/vacunas">
            <v-icon>mdi-needle</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <darkMode class="ma-1"/>
        </div>
    </v-app-bar>
</template>

<script setup>
import Logo from "@/assets/logo.svg";
import darkMode from "@/components/DarkModeToggle.vue"
</script>