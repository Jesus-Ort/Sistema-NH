<template>
    <v-container class="d-flex justify-center align-center">
        <v-form class="pa-4 w-50 w-auto" >
            
            <h2 class="text-center text-h4 mb-4 w-full">Registro De Pacientes</h2>

            <p class="text-center mb-4">Porfavor ingresa los datos para el registro del paciente.</p>

            <!-- Cedula de Identidad -->
            <v-text-field
                class="mt-4"
                v-model="nationalID"
                clearable
                label="Cedula de Identidad"
                color="primary"
                required
                :error-messages="cedulaError"
                prepend-icon="mdi-card"
            ></v-text-field>

            <!-- Nombre -->
            <v-text-field
                class="mt-4"
                v-model="firstName"
                clearable
                label="Nombre"
                color="primary"
                required
                :error-messages="firstNameError"
                prepend-icon="mdi-account">
            </v-text-field>

            <!-- Apellido -->
            <v-text-field
                class="mt-4"
                v-model="lastName"
                clearable
                label="Apellido"
                color="primary"
                required
                :error-messages="lastNameError"
                prepend-icon="mdi-account-box">
            </v-text-field>

            <!-- Fecha de Nacimiento -->
            <v-text-field
                class="mt-4"
                v-model="birthDate"
                clearable
                label="Fecha de Nacimiento"
                type="date"
                color="primary"
                required
                :error-messages="birthDateError"
                prepend-icon="mdi-calendar">
            </v-text-field>

            <!-- Genero -->
            <v-select
                class="mt-4"
                v-model="gender"
                :items="['M', 'F', 'O']"
                label="Género"
                color="primary"
                required
                :error-messages="genderError"
                prepend-icon="mdi-gender-male-female">
            </v-select>

            <!-- Dirección -->
            <v-text-field
                class="mt-4"
                v-model="address"
                clearable
                label="Dirección"
                color="primary"
                required
                :error-messages="addressError"
                prepend-icon="mdi-home">
            </v-text-field>

            <!-- Teléfono -->
            <v-text-field
                class="mt-4"
                v-model="phone"
                clearable
                label="Teléfono"
                color="primary"
                required
                :error-messages="phoneError"
                prepend-icon="mdi-phone">
            </v-text-field>

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
        nationalID: yup.string().required('La cédula de identidad es requerida').matches(/^\d{6,9}$/, 'Debe contener entre 6 y 9 dígitos'),
        firstName: yup.string().required('El nombre es requerido').min(2, "Debe contener mínimo 2 letras").matches(/^[a-zA-Z ]*$/, "Deben ser letras"),
        lastName: yup.string().required('El apellido es requerido').min(2, "Debe contener mínimo 2 letras").matches(/^[a-zA-Z ]*$/, "Deben ser letras"),
        birthDate: yup.date().required('La fecha de nacimiento es requerida').max(new Date(), 'La fecha de nacimiento no puede ser futura'),
        gender: yup.string().required('El género es requerido').max(1,"Maximo 1 caracter"),
        address: yup.string().required('La dirección es requerida'),
        phone: yup.string().required('El teléfono es requerido').matches(/^\d{7,14}$/, 'Debe contener entre 7 y 14 dígitos'),
        email: yup.string().matches(/^[\w-.]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/, 'Solo se permiten correos de Gmail, Outlook, Yahoo o Hotmail').required('El correo electrónico es requerido'),
    })
}); 

const { value: nationalID, errorMessage: cedulaError } = useField("nationalID");
const { value: firstName, errorMessage: firstNameError } = useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: birthDate, errorMessage: birthDateError } = useField("birthDate");
const { value: gender, errorMessage: genderError } = useField("gender");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: email, errorMessage: emailError } = useField("email");


const registro = handleSubmit((values) => {
    console.log('Formulario enviado con los siguientes datos:', values);
}); 

</script>
