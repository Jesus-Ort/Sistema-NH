<template>
    <v-container >
        <v-responsive>
            <h1>Bienvenido a Convit</h1>
            <p>Panel principal del sistema de gestión de vacunas</p>
        </v-responsive>        
    </v-container>

    <v-container class="mt-5 text-center">
        <v-responsive>
            <h3>Gráfica de barras para dosis aplicada:</h3>
            <DosisChart></DosisChart>
        </v-responsive>
    </v-container>
</template>
<script setup>
    import DosisChart from '@/components/DosisChart.vue'
</script>