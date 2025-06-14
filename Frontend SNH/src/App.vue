<template>
  <header>
    <h1>SNH Frontend</h1>
    <DarkModeToggle/>
    <loginComponent/>
    <RegistroUsuariosComponent/>
    <RegistroPacientesComponente/>
    <RegistroPais/>
    <RegistroAreaSalud/>
  </header>

  <RouterView />
</template>

<script setup>
import LoginComponent from './components/LoginComponent.vue';
import DarkModeToggle from './components/DarkModeToggle.vue';
import RegistroUsuariosComponent from './components/RegistroUsuariosComponent.vue';
import RegistroPacientesComponente from './components/RegistroPacientesComponente.vue';
import RegistroPais from './components/RegistroPais.vue';
import RegistroAreaSalud from './components/RegistroAreaSalud.vue';
</script>


<style scoped>
</style>
