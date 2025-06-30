<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-form class="pa-4">
        
                    <h2 class="text-center text-h4 mb-4 w-full">País</h2>
        
                    <p class="text-center mb-4">Porfavor ingresa el país de la vacuna.</p>
        
                    <!-- Pais -->
                    <v-text-field
                        class="mt-4"
                        v-model="country"
                        clearable
                        label="País"
                        required
                        color="text"
                        :error-messages="countryError"
                        prepend-icon="mdi-earth"
                    ></v-text-field>
        
                    <div class="d-flex justify-end mt-4">
                        <v-btn @click="registro()" 
                        block
                        :loading="loading"
                        :disabled="loading"
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
        country: yup.string().required('El país es requerido').min(3,"Debe contener minimo 3 letras").matches(/^[a-zA-ZñÑ ]+$/,"Solo pueden ser letras sin caracteres espciales ni numeros"),
    })
}); 

// Manejo de errores
const {value: country, errorMessage: countryError} = useField("country")

// Envio
const registro = handleSubmit( async (values) => {
    try {
        loading.value = true

        await axios.post('/api/v1/countries', {
        nameCountry: values.country
        }
        );

        $snackbar.success('¡Registro exitoso!');

    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al registrar el país: ${msg}`);
    } finally {
        loading.value = false;
    } 
}); 

</script>
