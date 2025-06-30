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
import GestionPacientes from '@/components/GestionPacientes.vue'
import RegistroPacientes from '@/components/RegistroPacientes.vue'

const componenteActual = shallowRef(GestionPacientes)

function mostrarRegistro() {
    componenteActual.value = RegistroPacientes
}

function mostrarGestion() {
    componenteActual.value = GestionPacientes
}
</script>
