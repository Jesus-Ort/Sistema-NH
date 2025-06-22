<template>
    <v-container class="d-flex justify-center align-center">
        <v-form class="pa-4 w-50 w-auto" >

            <h2 class="text-center text-h4 mb-4 w-full">Centro de Salud</h2>

            <p class="text-center mb-4">Porfavor ingresa los datos del centro de salud.</p>

            <!-- Nombre  -->
            <v-text-field
                class="mt-4"
                v-model="centerName"
                clearable
                label="Nombre del Centro de Salud"
                required
                color="text"
                :error-messages="centerNameError"
                prepend-icon="mdi-hospital-building"
            ></v-text-field>

            <!-- Dirección -->
            <v-text-field
                class="mt-4"
                v-model="centerAdress"
                clearable
                label="Dirección del Centro de Salud"
                required
                color="text"
                :error-messages="centerAdressError"
                prepend-icon="mdi-directions"
            ></v-text-field>

            <!-- Teléfono -->
            <v-text-field
                class="mt-4"
                v-model="centerPhone"
                clearable
                label="Teléfono del Centro de Salud"
                required
                color="text"
                :error-messages="centerPhoneError"
                prepend-icon="mdi-phone"
            ></v-text-field>

            <!-- Email -->
            <v-text-field
                class="mt-4"
                v-model="centerEmail"
                clearable
                label="Email del Centro de Salud"
                required
                color="text"
                :error-messages="centerEmailError"
                prepend-icon="mdi-email"
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

// Propiedad para formulario en pasos (si es necesaria)
const props = defineProps({
    multistep: {
    type: Boolean,
    default: false
    }
})

const emit = defineEmits(['next'])

// Validaciones
const { handleSubmit } = useForm({
    validationSchema: yup.object({
        centerName: yup.string().required('El nombre del centro de salud es requerido').min(3,"Debe contener minimo 3 letras").matches(/^[A-Za-z]+$/,"Solo pueden ser letras sin caracteres espciales ni numeros"),
        centerAdress: yup.string().required('La dirección del centro de salud es requerida').min(5,"Debe contener minimo 5 letras").matches(/^[A-Za-z0-9]+$/,"Solo numeros y letras sin caracteres especiales"),
        centerPhone: yup.string().required('El teléfono del centro de salud es requerido').min(7,"Debe contener minimo 7 números").matches(/^[0-9]+$/,"Solo pueden ser números"),
        centerEmail: yup.string().matches(/^[\w-.]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/, 'Solo se permiten correos de Gmail, Outlook, Yahoo o Hotmail').required('El correo electrónico es requerido'),
    })
}); 

// Manejo de errores
const {value: centerName, errorMessage: centerNameError} = useField("centerName")
const {value: centerAdress, errorMessage: centerAdressError} = useField("centerAdress")
const {value: centerPhone, errorMessage: centerPhoneError} = useField("centerPhone")
const {value: centerEmail, errorMessage: centerEmailError} = useField("centerEmail")

// Envio
const registro = handleSubmit((values) => {
    // Funcionalidad backend
    console.log('Formulario enviado con los siguientes datos:', values);
    if (props.multistep) {
        emit('next')
    }
}); 

</script>
