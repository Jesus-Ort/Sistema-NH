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
import GestionLotes from '@/components/GestionLotes.vue'
import RegistroLotes from '@/components/RegistroLotes.vue'

const componenteActual = shallowRef(GestionLotes)

function mostrarRegistro() {
    componenteActual.value = RegistroLotes
}

function mostrarGestion() {
    componenteActual.value = GestionLotes
}
</script>
