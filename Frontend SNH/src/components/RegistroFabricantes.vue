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
                    <v-autocomplete
                        class="mt-4"
                        v-model="country"
                        :items="['País 1', 'País 2', 'País 3']"
                        label="País"
                        color="text"
                        required
                        :error-messages="countryError"
                        prepend-icon="mdi-earth">
                    </v-autocomplete>
        
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
        manufacturer: yup.string().required('El fabricante es requerido').min(3,"Debe contener minimo 3 letras").matches(/^[A-Za-z]+$/,"Solo pueden ser letras sin caracteres espciales ni numeros"),
        country: yup.string().required('El país es requerido').min(3,"Debe contener minimo 3 letras"),
    })
}); 

// Manejo de errores
const {value: manufacturer, errorMessage: manufacturerError} = useField("manufacturer")
const {value: country, errorMessage: countryError} = useField("country")

// Envio
const registro = handleSubmit((values) => {
    // Funcionalidad backend
    console.log('Formulario enviado con los siguientes datos:', values);
    if (props.multistep) {
        emit('next')
    }
}); 

</script>
