<template>
  <header>
    <h1>SNH Frontend</h1>
    <DarkModeToggle/>
    <loginComponent/>
    <RegistroUsuariosComponent/>
    <RegistroPacientesComponente/>
  </header>

  <RouterView />
</template>

<script setup>
import LoginComponent from './components/LoginComponent.vue';
import DarkModeToggle from './components/DarkModeToggle.vue';
import RegistroUsuariosComponent from './components/RegistroUsuariosComponent.vue';
import RegistroPacientesComponente from './components/RegistroPacientesComponente.vue';

</script>


<style scoped>
</style>
