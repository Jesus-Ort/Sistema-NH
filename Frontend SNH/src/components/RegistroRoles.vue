<template>
    <v-container class="d-flex justify-center align-center">
        <v-form class="pa-4 w-50 w-auto" >

            <h2 class="text-center text-h4 mb-4 w-full">Role</h2>

            <p class="text-center mb-4">Porfavor ingresa el Role nuevo.</p>

            <!-- Role -->
            <v-text-field
                class="mt-4"
                v-model="role"
                clearable
                label="Role"
                required
                color="text"
                :error-messages="roleError"
                prepend-icon="mdi-account-cog"
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
        role: yup.string().required('El rol es requerido').min(3,"Debe contener minimo 3 letras").matches(/^[A-Za-z]+$/,"Solo pueden ser letras sin caracteres espciales ni numeros"),
    })
}); 

const {value: role, errorMessage: roleError} = useField("role")

const registro = handleSubmit((values) => {
    // Funcionalidad backend
    console.log('Formulario enviado con los siguientes datos:', values);
    if (props.multistep) {
        emit('next')
    }
}); 

</script>