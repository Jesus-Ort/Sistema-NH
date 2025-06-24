<template>
    <v-container fluid class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-form class="pa-4">
        
                    <h2 class="text-center text-h4 mb-4 w-full">Lotes de Vacunas</h2>
        
                    <p class="text-center mb-4">Porfavor ingresa los datos del lote.</p>
        
                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- Vacuna -->
                    <v-autocomplete
                        class="mt-4"
                        v-model="vaccine"
                        :items="['Vacuna 1', 'Vacuna 2', 'Vacuna 3']"
                        label="Vacuna"
                        color="text"
                        required
                        :error-messages="vaccineError"
                        prepend-icon="mdi-needle">
                    </v-autocomplete>
        
                    <!-- Numero del lote -->
                    <v-text-field
                        class="mt-4"
                        v-model="batchNumber"
                        clearable
                        label="Numero del Lote"
                        required
                        color="text"
                        :error-messages="batchNumberError"
                        prepend-icon="mdi-package"
                    ></v-text-field>
        
                    <!--  Fecha de fabricación del lote -->
                    <v-text-field
                        class="mt-4"
                        v-model="manufactureDate"
                        clearable
                        label="Fecha de fabricación del lote"
                        type="date"
                        color="text"
                        required
                        :error-messages="manufactureDateError"
                        prepend-icon="mdi-calendar">
                    </v-text-field>
        
                    <!--  Fecha de vencimiento del lote  -->
                    <v-text-field
                        class="mt-4"
                        v-model="expirationDate"
                        clearable
                        label="Fecha de vencimiento del lote "
                        type="date"
                        color="text"
                        required
                        :error-messages="expirationDateError"
                        prepend-icon="mdi-calendar">
                    </v-text-field>
        
                    <!-- Cantidad de viales en este lote inicialmente -->
                    <v-number-input 
                        class="mt-4"
                        v-model="initialQuantity"
                        clearable
                        label="Cantidad de viales en este lote inicialmente"
                        required
                        color="text"
                        :error-messages="initialQuantityError"
                        prepend-icon="mdi-asterisk"
                        control-variant="hidden"
                    ></v-number-input>
        
                    <!-- Cantidad de viales aún disponibles en este lote -->
                    <v-number-input 
                        class="mt-4"
                        v-model="availableQuantity"
                        clearable
                        label="Cantidad de viales aún disponibles en este lote"
                        required
                        color="text"
                        :error-messages="availableQuantityError"
                        prepend-icon="mdi-asterisk"
                        control-variant="hidden"
                    ></v-number-input>
        
                    <div class="d-flex justify-end mt-4">
                        <v-btn @click="registro()" block color="success">Registrar</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
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
        vaccine: yup.string().required('La vacuna es requerida').min(3,"Debe contener minimo 3 letras"),
        batchNumber: yup.number().typeError('El número de lote debe ser un número válido').required('El número del lote es obligatorio').min(1, "Debe ser al menos 1"),
        manufactureDate: yup.date().required('La fecha de fabricación es obligatoria').max(new Date(), 'La fecha de fabricación no puede ser futura'),
        expirationDate: yup.date().required('La fecha de vencimiento es obligatoria').min(new Date(), 'La fecha de vencimiento no puede ser pasada'),
        initialQuantity: yup.number().required('La cantidad inicial es obligatoria').min(1,"Debe ser al menos 1"),
        availableQuantity: yup.number().required('La cantidad disponible es obligatoria').min(1,"Debe ser al menos 1")
    })
}); 

// Manejo de errores
const {value: vaccine, errorMessage: vaccineError} = useField("vaccine")
const {value: batchNumber, errorMessage: batchNumberError} = useField("batchNumber")
const {value: manufactureDate, errorMessage: manufactureDateError} = useField("manufactureDate")
const {value: expirationDate, errorMessage: expirationDateError} = useField("expirationDate")
const {value: initialQuantity, errorMessage: initialQuantityError} = useField("initialQuantity")
const {value: availableQuantity, errorMessage: availableQuantityError} = useField("availableQuantity")

// Envio
const registro = handleSubmit((values) => {
    // Funcionalidad backend
    console.log('Formulario enviado con los siguientes datos:', values);
    if (props.multistep) {
        emit('next')
    }
}); 

</script>