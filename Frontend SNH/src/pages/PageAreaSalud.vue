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
import GestionAreaSalud from '@/components/GestionAreaSalud.vue'
import RegistroAreaSalud from '@/components/RegistroAreaSalud.vue'

const componenteActual = shallowRef(GestionAreaSalud)

function mostrarRegistro() {
    componenteActual.value = RegistroAreaSalud
}

function mostrarGestion() {
    componenteActual.value = GestionAreaSalud
}
</script>
