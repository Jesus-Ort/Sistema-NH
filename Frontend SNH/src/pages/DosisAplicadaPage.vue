<template>
    <v-container class="text-center">
        <v-responsive>
            <h3>Formulario por pasos para el registro de una dosis aplicada.</h3>
        </v-responsive>        
    </v-container>

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
