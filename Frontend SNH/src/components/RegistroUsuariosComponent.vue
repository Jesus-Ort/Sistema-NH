<template>
    <v-container class="d-flex justify-center align-center">
        <v-form class="pa-4 w-50 w-auto" >

            <h2 class="text-center text-h4 text-no-wrap mb-4 w-full">Registro De Usuarios</h2>

            <p class="text-center mb-4">Porfavor ingresa tus credenciales para registrarte.</p>

            <!-- Username -->
            <v-text-field
                class="mt-4"
                v-model="username"
                clearable
                label="Username"
                required
                color="primary"
                :error-messages="usernameError"
                prepend-icon="mdi-account"
            ></v-text-field>

            <!-- Password -->   
            <v-text-field
                class="mt-4"
                v-model="password"
                clearable
                label="Password"
                type="password"
                color="primary"
                required
                :error-messages="passwordError"
                prepend-icon="mdi-lock"
            ></v-text-field>

            <!-- Email -->
            <v-text-field
                class="mt-4"
                v-model="email"
                clearable
                label="Email"
                type="email"
                color="primary"
                required
                :error-messages="emailError"
                prepend-icon="mdi-email">
            </v-text-field>

            <!-- Nombre Completo -->
            <v-text-field
                class="mt-4"
                v-model="fullName"
                clearable
                label="Nombre Completo"
                color="primary"
                required
                :error-messages="fullNameError"
                prepend-icon="mdi-account-box">
            </v-text-field>

            <!-- Rol -->
            <v-select
                class="mt-4"
                v-model="role"
                :items="['Admin', 'User']"
                label="Rol"
                color="primary"
                required
                :error-messages="roleError"
                prepend-icon="mdi-account-cog">
            </v-select>

            <!-- Centro de Salud -->
            <v-select
                class="mt-4"
                v-model="healthCenter"
                :items="['Centro de Salud 1', 'Centro de Salud 2', 'Centro de Salud 3']"
                label="Centro de Salud"
                color="primary"
                required
                :error-messages="healthCenterError"
                prepend-icon="mdi-hospital-building">
            </v-select>

            <div class="d-flex justify-end mt-4">

                <v-btn @click="registro()" block color="success">Registrar</v-btn>

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
        password: yup.string().required('La contraseña es requerida').min(6,"Debe contener minimo 6 letras"),
        email: yup.string().matches(/^[\w-.]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/, 'Solo se permiten correos de Gmail, Outlook, Yahoo o Hotmail').required('El correo electrónico es requerido'),
        fullName: yup.string().required('El nombre completo es requerido').min(3, "Debe contener minimo 3 letras"),
        role: yup.string().required('El rol es requerido'),
        healthCenter: yup.string().required('El centro de salud es requerido'),
    })
}); 

const {value: username, errorMessage: usernameError} = useField("username")
const {value: password, errorMessage: passwordError} = useField("password")
const {value: email, errorMessage: emailError} = useField("email")
const {value: fullName, errorMessage: fullNameError} = useField("fullName")
const {value: role, errorMessage: roleError} = useField("role")
const {value: healthCenter, errorMessage: healthCenterError} = useField("healthCenter")

const registro = handleSubmit((values) => {
    console.log('Formulario enviado con los siguientes datos:', values);
}); 

</script>
