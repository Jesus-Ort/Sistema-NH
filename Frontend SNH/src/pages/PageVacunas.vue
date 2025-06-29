<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <v-btn color="secondary" @click="mostrarRegistro">
            Agregar
            </v-btn>
            <v-btn color="secondary" @click="mostrarGestion" class="ml-2">
            Gestión
            </v-btn>
        </v-col>
        </v-row>

        <v-row>
        <v-col cols="12">
            <component :is="componenteActual" />
        </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { shallowRef } from 'vue'
import GestionVacunas from '@/components/GestionVacunas.vue'
import RegistroVacunas from '@/components/RegistroVacunas.vue'

const componenteActual = shallowRef(GestionVacunas)

function mostrarRegistro() {
    componenteActual.value = RegistroVacunas
}

function mostrarGestion() {
    componenteActual.value = GestionVacunas
}
</script>
