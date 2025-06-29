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
import GestionDosis from '@/components/GestionDosis.vue'
import RegistroDosis from '@/components/RegistroDosis.vue'

const componenteActual = shallowRef(GestionDosis)

function mostrarRegistro() {
    componenteActual.value = RegistroDosis
}

function mostrarGestion() {
    componenteActual.value = GestionDosis
}
</script>
