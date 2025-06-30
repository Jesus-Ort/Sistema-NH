<template>
    <v-container fluid>
        <v-row justify="center">
        <v-col cols="12" sm="10" md="8">
            <v-card>
                <!-- Titulo -->
            <v-card-title class="text-h5">Registro de Paciente y Dosis</v-card-title>
            <!-- Contenido -->
            <v-card-text>
                <!-- Pasos del formulario -->
                <v-stepper v-model="step">
                    <!-- Titulos de los pasos -->
                <v-stepper-header>
                    <!-- Genera dinamicamente los pasos -->
                    <v-stepper-item
                    v-for="(paso, index) in pasos"
                    :key="index"
                    :title="paso.title"
                    :value="index + 1"
                    />
                </v-stepper-header>
                <!-- Contenido de los pasos -->
                <v-stepper-window>
                    <v-stepper-window-item :value="1">
                    <RegistroPacientes :key="'paciente-' + step" />
                    </v-stepper-window-item>

                    <v-stepper-window-item :value="2">
                    <RegistroDosis :key="'dosis-' + step" />
                    </v-stepper-window-item>
                </v-stepper-window>
                </v-stepper>
            </v-card-text>
            <!-- Botones de navegación -->
            <v-card-actions class="justify-space-between">
                <v-btn
                :disabled="step === 1"
                @click="step--"
                color="text"
                variant="tonal"
                icon="mdi-chevron-left"
                ></v-btn>

                <v-btn
                :disabled="step === pasos.length"
                @click="step++"
                color="text"
                variant="tonal"
                icon="mdi-chevron-right"
                ></v-btn>
            </v-card-actions>

            </v-card>
        </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import RegistroPacientes from '@/components/RegistroPacientes.vue'
import RegistroDosis from '@/components/RegistroDosis.vue'

// Estado del paso actual
const step = ref(1)
// Definición de los pasos del formulario
// Cada paso tiene un título que se mostrará en el encabezado del stepper
const pasos = [
    { title: 'Registro de Paciente' },
    { title: 'Registro de Dosis' }
]
</script>
