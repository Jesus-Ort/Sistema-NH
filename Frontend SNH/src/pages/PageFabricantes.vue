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
import GestionFabricantes from '@/components/GestionFabricantes.vue'
import RegistroFabricantes from '@/components/RegistroFabricantes.vue'

const componenteActual = shallowRef(GestionFabricantes)

function mostrarRegistro() {
    componenteActual.value = RegistroFabricantes
}

function mostrarGestion() {
    componenteActual.value = GestionFabricantes
}
</script>
