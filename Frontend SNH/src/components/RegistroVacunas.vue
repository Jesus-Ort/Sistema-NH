<template>
    <v-container class="d-flex justify-center align-center">
        <v-form class="pa-4 w-50 w-auto" >

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
            <v-autocomplete
                class="mt-4"
                v-model="manufacturer"
                :items="['Fabricante 1', 'Fabricante 2', 'Fabricante 3']"
                label="Fabricante"
                color="text"
                required
                :error-messages="manufacturerError"
                prepend-icon="mdi-factory">
            </v-autocomplete>

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
        name: yup.string().required('El nombre es requerido').min(3,"Debe contener minimo 3 letras").matches(/^[A-Za-z0-9]+$/,"Solo numeros y letras sin caracteres especiales"),
        manufacturer: yup.string().required('El fabricante es requerido').min(3,"Debe contener minimo 3 letras"),
        requiredDoses: yup.number().required('Las dosis requeridas son obligatorias').min(1, "Debe ser al menos 1 dosis"),
        intervalDoses: yup.number().required('El intervalo de dias para la dosis es obligatorio').min(1,"Debe ser al menos 1 día"),
        temperature: yup.string().required('Los requisitos son obligatorios').min(5,'Debe contener minimo 5 letras')
    })
}); 

const {value: name, errorMessage: nameError} = useField("name")
const {value: manufacturer, errorMessage: manufacturerError} = useField("manufacturer")
const {value: requiredDoses, errorMessage: requiredDosesError} = useField("requiredDoses")
const {value: intervalDoses, errorMessage: intervalDosesError} = useField("intervalDoses")
const {value: temperature, errorMessage: temperatureError} = useField("temperature")

const registro = handleSubmit((values) => {
    // Funcionalidad backend
    console.log('Formulario enviado con los siguientes datos:', values);
    if (props.multistep) {
        emit('next')
    }
}); 

</script>
