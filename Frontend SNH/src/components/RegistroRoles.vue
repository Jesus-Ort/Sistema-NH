<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-form class="pa-4">
        
                    <h2 class="text-center text-h4 mb-4 w-full">Rol</h2>
        
                    <p class="text-center mb-4">Porfavor ingresa el Rol nuevo.</p>
        
                    <!-- Role -->
                    <v-text-field
                        class="mt-4"
                        v-model="role"
                        clearable
                        label="Rol"
                        required
                        color="text"
                        :error-messages="roleError"
                        prepend-icon="mdi-account-cog"
                    ></v-text-field>
        
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

// Validaciones
const { handleSubmit } = useForm({
    validationSchema: yup.object({
        role: yup.string().required('El rol es requerido').min(3,"Debe contener minimo 3 letras").matches(/^[A-Za-z]+$/,"Solo pueden ser letras sin caracteres espciales ni numeros"),
    })
}); 

// Manejo de errores
const {value: role, errorMessage: roleError} = useField("role")

// Envio
const registro = handleSubmit(() => {
    // Funcionalidad backend
    console.log(`este componente no esta siendo utilizado en el backend, 
    pero se puede implementar la funcionalidad de registro de roles aquí`);
}); 
</script>
