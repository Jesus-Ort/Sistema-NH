<template>
    <v-container class="d-flex justify-center align-center">
        <v-form class="pa-4 w-50 w-auto" >

            <h2 class="text-center text-h4 mb-4 w-full">Dosis</h2>

            <p class="text-center mb-4">Porfavor ingresa los datos de la dosis.</p>

            <!-- Buscado por nombre, agregado como array, devolver ID  -->
            <!-- Paciente -->
            <v-autocomplete
                class="mt-4"
                v-model="paciente"
                :items="['Paciente 1', 'Paciente 2', 'Paciente 3']"
                label="C.I del Paciente"
                color="text"
                required
                :error-messages="pacienteError"
                prepend-icon="mdi-human">
            </v-autocomplete>
            
            <!-- Buscado por nombre, agregado como array, devolver ID  -->
            <!--Numero de Lote -->
            <v-autocomplete
                class="mt-4"
                v-model="lote"
                :items="['Lote 1', 'Lote 2', 'Lote 3']"
                label="Numero del Lote"
                color="text"
                required
                :error-messages="loteError"
                prepend-icon="mdi-package">
            </v-autocomplete>

            <!-- Numero de dosis -->
            <v-number-input 
                class="mt-4"
                v-model="doseNumber"
                clearable
                label=" Número de la dosis"
                required
                color="text"
                :error-messages="doseNumberError"
                prepend-icon="mdi-needle"
                control-variant="hidden"
            ></v-number-input>

            <!--  Fecha de aplicacion de la dosis  -->
            <v-text-field
                class="mt-4"
                v-model="aplicationDate"
                clearable
                label="Fecha de aplicacion de la dosis"
                type="date"
                color="text"
                required
                :error-messages="aplicationDateError"
                prepend-icon="mdi-calendar">
            </v-text-field>

            <!-- Buscado por nombre, agregado como array, devolver ID  -->
            <!-- Centro de Salud -->
            <v-autocomplete
                class="mt-4"
                v-model="center"
                :items="['Centro de Salud 1', 'Centro de Salud 2', 'Centro de Salud 3']"
                label="Centro de Salud"
                color="text"
                required
                :error-messages="centerError"
                prepend-icon="mdi-hospital-building">
            </v-autocomplete>

            <!-- Nombre del profesional de salud que aplicó la dosis -->
            <v-text-field
                class="mt-4"
                v-model="healthProfessional"
                clearable
                label="Nombre de quién aplicó la dosis"
                required
                color="text"
                :error-messages="healthProfessionalError"
                prepend-icon="mdi-stethoscope"
            ></v-text-field>

            <!-- Observaciones -->
            <v-text-field
                class="mt-4"
                v-model="observaciones"
                clearable
                label="Observaciones"
                required
                color="text"
                :error-messages="observacionesError"
                prepend-icon="mdi-eye"
            ></v-text-field>

            <div class="d-flex justify-end mt-4">

                <v-btn @click="registro()" block color="success">Registrar</v-btn>

            </div>

        </v-form>
    </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps({
    multistep: {
    type: Boolean,
    default: false
    }
})

const emit = defineEmits(['next'])


const { handleSubmit } = useForm({
    validationSchema: yup.object({
        paciente: yup.string().required("El paciente es requerido").min(3,"Debe contener minimo 3 letras"),
        lote: yup.string().required('El número de lote es requerido').min(3,"Debe contener minimo 3 letras"),
        doseNumber: yup.number().required("El número de la dosis aplicada es requerido").min(1,"Debe ser al menos 1 dosis"),
        aplicationDate: yup.date().required("La fecha de aplicacion es requerida").max(new Date(), 'La fecha de aplicacion no puede ser futura'),
        center: yup.string().required("El centro de salud es requerido").min(3,"Debe contener minimo 3 letras"),
        healthProfessional: yup.string().required("El Profesional de Salud es requerido").min(3,"Debe contener minimo 3 letras").matches(/^[a-zA-Z ]*$/, "Deben ser letras"),
        observaciones: yup.string().max(1000,"Máximo 1000 letras")
    })
}); 

const {value: paciente, errorMessage: pacienteError} = useField("paciente")
const {value: lote, errorMessage: loteError} = useField("lote")
const {value: doseNumber, errorMessage: doseNumberError} = useField("doseNumber")
const {value: aplicationDate, errorMessage: aplicationDateError} = useField("aplicationDate")
const {value: center, errorMessage: centerError} = useField("center")
const {value: healthProfessional, errorMessage: healthProfessionalError} = useField("healthProfessional")
const {value: observaciones, errorMessage: observacionesError} = useField("observaciones")

const registro = handleSubmit((values) => {
    // Funcionalidad backend
    console.log('Formulario enviado con los siguientes datos:', values);
    if (props.multistep) {
        emit('next')
    }
}); 

</script>
