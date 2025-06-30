<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-form class="pa-4" >
        
                    <h2 class="text-center text-h4 mb-4 w-full">Vacunas</h2>
        
                    <p class="text-center mb-4">Porfavor ingresa los datos de la vacuna.</p>
        
                    <!-- Nombre -->
                    <v-text-field
                        class="mt-4"
                        v-model="name"
                        clearable
                        label="Nombre de la vacuna"
                        required
                        color="text"
                        :error-messages="nameError"
                        prepend-icon="mdi-needle"
                    ></v-text-field>

                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- Fabricante -->
                    <v-select
                        class="mt-4"
                        v-model="manufacturer"
                        :items="fabricantes"
                        item-title="manufacturerName"
                        :item-value="'id'"
                        :loading="loadingFabricantes"
                        label="Fabricante"
                        color="text"
                        required
                        :error-messages="manufacturerError"
                        prepend-icon="mdi-factory">
                    </v-select>
        
                    <!-- Dosis requerida -->
                    <v-number-input 
                        class="mt-4"
                        v-model="requiredDoses"
                        clearable
                        label="Dosis requerida para la inmunización"
                        required
                        color="text"
                        :error-messages="requiredDosesError"
                        prepend-icon="mdi-check"
                        control-variant="hidden"
                    ></v-number-input>
        
                    <!-- Intervalo de dias entre dosis -->
                    <v-number-input 
                        class="mt-4"
                        v-model="intervalDoses"
                        clearable
                        label="Intervalo recomendado entre dosis en días"
                        required
                        color="text"
                        :error-messages="intervalDosesError"
                        prepend-icon="mdi-calendar-range"
                        control-variant="hidden"
                    ></v-number-input>
        
                    <!-- Temperatura -->
                    <v-text-field
                        class="mt-4"
                        v-model="temperature"
                        clearable
                        label="Requisitos de temperatura de almacenamiento"
                        required
                        color="text"
                        :error-messages="temperatureError"
                        prepend-icon="mdi-thermometer"
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
import { ref, onMounted } from 'vue'
import axios from '@/services/axios';
import { useSnackbar } from '@/composables/useSnackbar'

const $snackbar = useSnackbar()
const fabricantes = ref([]);
const loading = ref(false)
const loadingFabricantes = ref(false)

onMounted(async () => {
    try {
    loadingFabricantes.value = true;
    const response = await axios.get('/api/v1/manufacturers');
    fabricantes.value = response.data;
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al cargar los fabricantes: ${msg}`);
    } finally {
    loadingFabricantes.value = false;
    }
});

// Validaciones
const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required('El nombre es requerido').min(1, "Debe contener minimo 1 letras").matches(/^[a-zA-Z0-9 +\-°]+$/,"Solo pueden ser letras, numeros y signos (+ - °) sin tildes"),
        manufacturer: yup.string().required('El fabricante es requerido').min(1,"Debe contener minimo 3 letras"),
        requiredDoses: yup.number().required('Las dosis requeridas son obligatorias').min(1, "Debe ser al menos 1 dosis"),
        intervalDoses: yup.number().required('El intervalo de dias para la dosis es obligatorio').min(1,"Debe ser al menos 1 día"),
        temperature: yup.string().required('Los requisitos son obligatorios').min(5,'Debe contener minimo 5 letras').matches(/^[a-zA-Z0-9 +\-°]+$/,"Solo pueden ser letras, numeros y signos (+ - °) sin tildes")
    })
}); 

// Manejo de errores
const {value: name, errorMessage: nameError} = useField("name")
const {value: manufacturer, errorMessage: manufacturerError} = useField("manufacturer")
const {value: requiredDoses, errorMessage: requiredDosesError} = useField("requiredDoses")
const {value: intervalDoses, errorMessage: intervalDosesError} = useField("intervalDoses")
const {value: temperature, errorMessage: temperatureError} = useField("temperature")

// Envio
const registro = handleSubmit( async (values) => {
    try {
        loading.value = true

        await axios.post('/api/v1/vaccines', {
        vaccineName: values.name,
        requiredDoses: values.requiredDoses,
        doseIntervalDays: values.intervalDoses,
        storageTemperature: values.temperature,
        manufacturerId: values.manufacturer
        }
        );

        $snackbar.success('¡Registro exitoso!');

    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al registrar la vacuna: ${msg}`);
    } finally {
        loading.value = false;
    }
}); 

</script>
