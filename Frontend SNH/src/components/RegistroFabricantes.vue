<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-form class="pa-4" >
        
                    <h2 class="text-center text-h4 mb-4 w-full">Fabricantes</h2>
        
                    <p class="text-center mb-4">Porfavor ingresa el fabricante de la vacuna.</p>
        
                    <!-- Fabricante -->
                    <v-text-field
                        class="mt-4"
                        v-model="manufacturer"
                        clearable
                        label="Fabricante"
                        required
                        color="text"
                        :error-messages="manufacturerError"
                        prepend-icon="mdi-factory"
                    ></v-text-field>
        
        
                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- País -->
                    <v-select
                        class="mt-4"
                        v-model="country"
                        :items="paises"
                        item-title="nameCountry"
                        :item-value="'id'"
                        :loading="loadingPaises"
                        label="País"
                        color="text"
                        required
                        :error-messages="countryError"
                        prepend-icon="mdi-earth">
                    </v-select>
        
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
import { ref, onMounted } from 'vue'
import axios from '@/services/axios';
import { useSnackbar } from '@/composables/useSnackbar'

const $snackbar = useSnackbar()
const paises = ref([]);
const loading = ref(false)
const loadingPaises = ref(false)

onMounted(async () => {
    try {
    loadingPaises.value = true;
    const response = await axios.get('/api/v1/countries');
    paises.value = response.data;
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al cargar los paises: ${msg}`);
    } finally {
    loadingPaises.value = false;
    }
});

// Validaciones
const { handleSubmit } = useForm({
    validationSchema: yup.object({
        manufacturer: yup.string().required('El fabricante es requerido').min(1,"Debe contener mínimo 1 caracter").matches(/^[a-zA-Z\s]+$/,"Solo pueden ser letras sin tildes"),
        country: yup.string().required('El país es requerido').min(1,"Debe contener mínimo 1 caracter"),
    })
}); 

// Manejo de errores
const {value: manufacturer, errorMessage: manufacturerError} = useField("manufacturer")
const {value: country, errorMessage: countryError} = useField("country")

// Envio
const registro = handleSubmit( async (values) => {
    try {
        loading.value = true

        await axios.post('/api/v1/manufacturers', {
        manufacturerName: values.manufacturer,
        countryId: values.country,
        }
        );

        $snackbar.success('¡Registro exitoso!');

    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al registrar el fabricante: ${msg}`);
    } finally {
        loading.value = false;
    }
}); 

</script>
