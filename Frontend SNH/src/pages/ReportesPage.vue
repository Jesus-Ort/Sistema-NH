<template>
    <v-container >
        <v-responsive>
            <h3 class="mb-4">Reportes de Vacunas:</h3>

            <VacunasAplicadas></VacunasAplicadas>
        </v-responsive>        
    </v-container>
</template>
<script setup>
import VacunasAplicadas from '@/components/VacunasAplicadas.vue';
</script>