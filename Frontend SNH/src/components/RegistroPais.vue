<template>
    <v-container class="d-flex justify-center align-center">
        <v-form class="pa-4 w-50 w-auto" >

            <h2 class="text-center text-h4 mb-4 w-full">Pais</h2>

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
        country: yup.string().required('El país es requerido').min(3,"Debe contener minimo 3 letras"),
    })
}); 

const {value: country, errorMessage: countryError} = useField("country")

const registro = handleSubmit((values) => {
    console.log('Formulario enviado con los siguientes datos:', values);
    if (props.multistep) {
        emit('next')
    }
}); 

</script>
