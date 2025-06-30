<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-form class="pa-4">
        
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
                        v-model="address"
                        clearable
                        label="Dirección del Centro de Salud"
                        required
                        color="text"
                        :error-messages="addressError"
                        prepend-icon="mdi-directions"
                    ></v-text-field>
        
                    <!-- Teléfono -->
                    <v-text-field
                        class="mt-4"
                        v-model="phone"
                        clearable
                        label="Teléfono del Centro de Salud"
                        required
                        color="text"
                        :error-messages="phoneError"
                        prepend-icon="mdi-phone"
                    ></v-text-field>

                    <!-- Teléfono Móvil -->
                    <v-text-field
                        class="mt-4"
                        v-model="mobilePhone"
                        clearable
                        label="Teléfono Móvil del Centro de Salud"
                        required
                        color="text"
                        :error-messages="mobilePhoneError"
                        prepend-icon="mdi-phone"
                    ></v-text-field>

                    <!-- Email -->
                    <v-text-field
                        class="mt-4"
                        v-model="email"
                        clearable
                        label="Email del Centro de Salud"
                        required
                        color="text"
                        :error-messages="emailError"
                        prepend-icon="mdi-email"
                    ></v-text-field>
        
                    <div class="d-flex justify-end mt-4">
                        <v-btn
                        @click="registro()" 
                        :loading="loading"
                        :disabled="loading"  
                        block 
                        color="success">Registrar</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import axios from '@/services/axios';
import { useSnackbar } from '@/composables/useSnackbar'

const $snackbar = useSnackbar()
const loading = ref(false)

// Validaciones
const { handleSubmit } = useForm({
    validationSchema: yup.object({
        centerName: yup.string().required('El nombre del centro de salud es requerido').min(3,"Debe contener mínimo 3 caracteres").matches(/^[a-zA-Z0-9 _-]+$/,"Solo pueden ser letras, numeros y signos ( - _ )"),
        address: yup.string().required('La dirección del centro de salud es requerida').min(1,"Debe contener mínimo 1 caracter").matches(/^[a-zA-Z0-9 _-]+$/,"Solo pueden ser letras, numeros y signos ( - _ )"),
        phone: yup.string().required('El teléfono del centro de salud es requerido').min(11,"Debe contener minimo 11 números").matches(/^[0-9]+$/,"Solo pueden ser números"),
        mobilePhone: yup.string().required('El teléfono del centro de salud es requerido').min(11,"Debe contener minimo 11 números").matches(/^[0-9]+$/,"Solo pueden ser números"),
        email: yup.string().matches(/^[\w-.]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/, 'Solo se permiten correos de Gmail, Outlook, Yahoo o Hotmail').required('El correo electrónico es requerido'),
    })
}); 

// Manejo de errores
const {value: centerName, errorMessage: centerNameError} = useField("centerName")
const {value: address, errorMessage: addressError} = useField("address")
const {value: phone, errorMessage: phoneError} = useField("phone")
const {value: mobilePhone, errorMessage: mobilePhoneError} = useField("mobilePhone")
const {value: email, errorMessage: emailError} = useField("email")

// Envio
const registro = handleSubmit( async (values) => {
    try {
        loading.value = true

        await axios.post('/api/v1/vaccination-centers', {
        centerName: values.centerName,
        address: values.address,
        phone: values.phone,
        mobilePhone: values.mobilePhone,
        email: values.email
        }
        );

        $snackbar.success('¡Registro exitoso!');

    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al registrar el centro de salud: ${msg}`);
    } finally {
        loading.value = false;
    }
}); 

</script>
