<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
            <v-form class="pa-4" @submit.prevent="login">

            <h2 class="text-center text-h4 mb-4">Login</h2>

            <p class="text-center mb-4">Por favor ingresa tus credenciales para ingresar.</p>

            <!-- Usuario -->
            <v-text-field
                class="mt-4"
                v-model="email"
                clearable
                label="Email"
                required
                color="text"
                :error-messages="emailError"
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
                <v-btn
                :loading="loading"
                :disabled="loading"
                block
                color="success" 
                @click="login">Login</v-btn>
            </div>

            </v-form>
        </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from '@/services/axios';
import { useSnackbar } from '@/composables/useSnackbar'
import { useUserStore } from '@/stores/users.js'

const $snackbar = useSnackbar()

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)

onMounted(() => {
    if (route.query.reason === 'expired') {
    // Muestra snackbar de sesión expirada
    $snackbar.warning('Sesión expirada'); 
    } else if (route.query.reason === 'invalid') {
    // Muestra snackbar de token invalido
    $snackbar.warning('Token inválido');
    } else if (route.query.reason === 'required') {
    // Muestra snackbar de necesitas token
    $snackbar.warning('Necesitas iniciar sesión');
    }
});

// Validaciones
const { handleSubmit } = useForm({
    validationSchema: yup.object({
        email: yup.string().matches(/^[\w-.]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/, 'Solo se permiten correos de Gmail, Outlook, Yahoo o Hotmail').required('El correo electrónico es requerido'),
        password: yup.string().required('La contraseña es requerida').min(6,"Debe contener minimo 6 letras")
    })
}); 

// Manejo de errores
const {value: email, errorMessage: emailError} = useField("email")
const {value: password, errorMessage: passwordError} = useField("password")

// Función para reintentar el login
async function retryLogin(values) {
    try {
        loading.value = true
        const response = await axios.post('/api/v1/auth/login', {
            email: values.email,
            password: values.password
        });

        // Guardar el token 
        const token = response.data.token;
        localStorage.setItem('token', token);

        // Guardar el rol del usuario
        const userRole = response.data.role
        userStore.setRole(userRole)

        $snackbar.success('Reintento exitoso')
        router.push('/inicio')
    } catch (error) {
        const msg = error.response?.data?.message || 'Falló el login'
        $snackbar.error(`Algo salió mal al hacer login: ${msg}`, {
        actions: [ { text: 'Reintentar', onClick:() => retryLogin(values) } ]
        })
    }
}

// Envio
const login = handleSubmit(async (values) => {
    try {
        loading.value = true
        const response = await axios.post('/api/v1/auth/login', {
            email: values.email,
            password: values.password
        });

        const token = response.data.token;
        const role = response.data.role
        
        // Guardamos en el store
        userStore.setToken(token)
        userStore.setRole(role)

        $snackbar.success('Login exitoso')
        // Redirigir al inicio
        router.push('/inicio');
    } catch (error) {
        const msg = error.response?.data?.message || 'Falló el login'
        $snackbar.error(`Algo salió mal al hacer login: ${msg}`, {
        actions: [ { text: 'Reintentar', onClick:() => retryLogin(values) } ]
        })
    } finally {
        loading.value = false
    }
})

</script>