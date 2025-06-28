<template>
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <h3 class="mb-4">Gestion de Vacunas:</h3>
                    <p>En esta sección podrás gestionar las vacunas aplicadas a los pacientes.</p>
                    <p>Podrás ver, editar y eliminar las vacunas aplicadas.</p>
                    <div class="d-flex justify-end mt-4">
                        <v-btn 
                            @click="registro()"
                            :loading="loading"
                            :disabled="loading" 
                            block 
                            color="success">Registrar Vacunas</v-btn>
                    </div>
                    <VacunasAplicadas></VacunasAplicadas>
                </v-col>
            </v-row>
        </v-container>
</template>
<script setup>
import VacunasAplicadas from '@/components/VacunasAplicadas.vue';
</script>