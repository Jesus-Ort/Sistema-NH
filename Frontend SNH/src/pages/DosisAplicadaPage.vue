<!--
    DosisAplicadaPage.vue

    Este componente Vue implementa un formulario por pasos para registrar una dosis aplicada.
    - Muestra un formulario paso a paso usando componentes dinámicos.
    - Pasos:
        1. Registro de Paciente (RegistroPacientes.vue)
        2. Registro de Dosis (RegistroDosis.vue)
    - Al completar el último paso, se muestra un diálogo (DialogRegistroVacunas.vue) para confirmar o mostrar información adicional.
    - La ref `step` rastrea el paso actual del formulario.
    - La ref `showDialog` controla la visibilidad del diálogo.
    - La función `goToNextStep` avanza el formulario o muestra el diálogo al finalizar, y luego reinicia el paso.
    - La propiedad computada `currentForm` selecciona dinámicamente el componente de formulario para el paso actual.
-->
<template>
    <h3 m-auto>Formulario por pasos para el registro de una dosis aplicada.</h3>
    <component :is="currentForm" @next="goToNextStep" :multistep="true"/>
    <DialogRegistroVacunas :modelValue="showDialog" @update:modelValue="showDialog = $event" />
</template>

<script setup>
import { ref, computed } from 'vue'
import Form1 from '@/components/RegistroPacientes.vue'
import Form2 from '@/components/RegistroDosis.vue'
import DialogRegistroVacunas from '@/components/DialogRegistroVacunas.vue'

const step = ref(1)
const showDialog = ref(false)

const forms = {
    1: Form1,
    2: Form2,
}

const currentForm = computed(() => forms[step.value])

function goToNextStep() {
    if (step.value < 2) {
    step.value++
    } else {
    // Mostrar el dialog al finalizar el ultimo paso
    showDialog.value = true
    // Resetear
    step.value = 1
    }
}
</script>
