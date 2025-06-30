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
import GestionPais from '@/components/GestionPais.vue'
import RegistroPais from '@/components/RegistroPais.vue'

const componenteActual = shallowRef(GestionPais)

function mostrarRegistro() {
    componenteActual.value = RegistroPais
}

function mostrarGestion() {
    componenteActual.value = GestionPais
}
</script>
