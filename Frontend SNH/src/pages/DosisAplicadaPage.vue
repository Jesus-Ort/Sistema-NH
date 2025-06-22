<template>
    <h3 m-auto>Formulario por pasos para el registro de una dosis aplicada.</h3>
    <component :is="currentForm" @next="goToNextStep" :multistep="true"/>
</template>

<script setup>
import { ref, computed } from 'vue'
import Form1 from '@/components/RegistroPacientes.vue'
import Form2 from '@/components/RegistroDosis.vue'

const step = ref(1)

const forms = {
    1: Form1,
    2: Form2,
}

const currentForm = computed(() => forms[step.value])

function goToNextStep() {
    if (step.value < 2) {
    step.value++
    } else {
    alert('¡Vacuna registrada correctamente!')
    // Aquí puedes redirigir o resetear el flujo
    step.value = 1
    }
}
</script>
