<template>
  <header>
    <h1>SNH Frontend</h1>
    <DarkModeToggle/>
    <loginComponent/>
    <RegistroUsuariosComponent/>
    <RegistroPacientesComponente/>
    <RegistroPais/>
    <RegistroAreaSalud/>
    <RegistroFabricantes/>
    <RegistroVacunas/>
    <RegistroLotes/>
    <RegistroDosis/>
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
import RegistroFabricantes from './components/RegistroFabricantes.vue';
import RegistroVacunas from './components/RegistroVacunas.vue';
import RegistroLotes from './components/RegistroLotes.vue'
import RegistroDosis from './components/RegistroDosis.vue';
</script>


<style scoped>
</style>
