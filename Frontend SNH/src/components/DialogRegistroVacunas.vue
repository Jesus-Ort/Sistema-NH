<template>
    <v-dialog
    v-model="internalModel"
    max-width="500"
    transition="dialog-bottom-transition">
    <v-card title="Registro Terminado">
        <v-card-text>¡Enviado exitosamente!</v-card-text>
        <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" @click="emit('update:modelValue', false)" />
        </v-card-actions>
    </v-card>
    </v-dialog>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const internalModel = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})
</script>