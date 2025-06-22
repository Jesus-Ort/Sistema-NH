<template>
    <v-container class="d-flex justify-center align-center">
        <v-form class="pa-4 w-50 w-auto" >

            <h2 class="text-center text-h4 mb-4">Login</h2>

            <p class="text-center mb-4">Porfavor ingresa tus credenciales para ingresar.</p>

            <!-- Usuario -->
            <v-text-field
                class="mt-4"
                v-model="username"
                clearable
                label="Nombre de Usuario"
                required
                color="text"
                :error-messages="usernameError"
                prepend-icon="mdi-account"
            ></v-text-field>

            <!-- Contraseña -->
            <v-text-field
                class="mt-4"
                v-model="password"
                clearable
                label="Contraseña"
                type="password"
                color="text"
                required
                :error-messages="passwordError"
                prepend-icon="mdi-lock"
            ></v-text-field>

            <div class="d-flex justify-end mt-4">

                <v-btn @click="login()" block color="success">Login</v-btn>

            </div>

        </v-form>
    </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'


const { handleSubmit } = useForm({
    validationSchema: yup.object({
        username: yup.string().required('El nombre de usuario es requerido').min(3,"Debe contener minimo 3 letras"),
        password: yup.string().required('La contraseña es requerida').min(6,"Debe contener minimo 6 letras")
    })
}); 

const {value: username, errorMessage: usernameError} = useField("username")
const {value: password, errorMessage: passwordError} = useField("password")

const login = handleSubmit((values) => {
    console.log('Formulario enviado con los siguientes datos:', values);
}); 

</script>
