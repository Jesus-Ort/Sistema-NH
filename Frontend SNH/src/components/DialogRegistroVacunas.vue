<!--
    DialogRegistroVacunas.vue

    Descripción:
    Este componente muestra un diálogo para informar al usuario que un proceso de registro se ha completado exitosamente (Dosis aplicada).
    Utiliza el componente <v-dialog> de Vuetify y se controla mediante la prop `modelValue` para enlace bidireccional.

    Props:
        - modelValue (Boolean): Controla la visibilidad del diálogo. Cuando es true, el diálogo se muestra.

    Emits:
        - update:modelValue (Boolean): Se emite cuando se cierra el diálogo, permitiendo que el padre actualice el estado de visibilidad.

    Uso:
        <DialogRegistroVacunas v-model="showDialog" />

    Características:
        - Muestra un mensaje de confirmación "¡Enviado exitosamente!".
        - Proporciona un botón "Cerrar" para cerrar el diálogo.
        - Soporta animación de transición para la aparición del diálogo.
-->
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

/**
* Props:
* - modelValue (Booleano): Controla la visibilidad o el estado del componente de diálogo.
*
* Emit:
* - update:modelValue: Se emite cuando el modelo interno cambia, lo que permite la vinculación bidireccional con el componente principal.
*
* Computed:
* - internalModel: Una propiedad calculada que representa la propiedad modelValue para la vinculación bidireccional.
* - get: Devuelve el valor actual de modelValue.
* - set: Emite 'update:modelValue' con el nuevo valor para actualizar el componente principal.
*/
const props = defineProps({
    modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const internalModel = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})
</script>