<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-form class="pa-4" >
        
                    <h2 class="text-center text-h4 mb-4 w-full">Registro De Usuarios</h2>
        
                    <p class="text-center mb-4">Porfavor ingresa los datos para el registro.</p>
        
                    <!-- Nombre -->
                    <v-text-field
                        class="mt-4"
                        v-model="name"
                        clearable
                        label="Nombre"
                        required
                        color="text"
                        :error-messages="nameError"
                        prepend-icon="mdi-account"
                    ></v-text-field>

                    <!-- Apellido -->
                    <v-text-field
                        class="mt-4"
                        v-model="lastname"
                        clearable
                        label="Apellido"
                        color="text"
                        required
                        :error-messages="lastnameError"
                        prepend-icon="mdi-account">
                    </v-text-field>

                    <!-- Rol -->
                    <v-select
                        class="mt-4"
                        v-model="role"
                        :items="['admin', 'health']"
                        label="Rol"
                        color="text"
                        required
                        :error-messages="roleError"
                        prepend-icon="mdi-account-cog">
                    </v-select>
        
                    <!-- Email -->
                    <v-text-field
                        class="mt-4"
                        v-model="email"
                        clearable
                        label="Email"
                        type="email"
                        color="text"
                        required
                        :error-messages="emailError"
                        prepend-icon="mdi-email">
                    </v-text-field>
        
        
                    <!-- Password -->   
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

                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- Centro de Salud -->
                    <v-select
                        class="mt-4"
                        v-model="vaccinationCenterId"
                        :items="centrosSalud"
                        item-title="centerName"
                        :item-value="'id'"
                        :loading="loadingCentros"
                        :disabled="role === 'admin'"
                        label="Centro de Salud"
                        color="text"
                        :error-messages="vaccinationCenterIdError"
                        prepend-icon="mdi-hospital-building">
                    </v-select>
        
                    <div class="d-flex justify-end mt-4">
                        <v-btn 
                        @click="registro()"
                        :loading="loading"
                        :disabled="loading" 
                        block 
                        color="success">Registrar</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/services/axios';
import * as yup from 'yup'
import { useSnackbar } from '@/composables/useSnackbar'

const $snackbar = useSnackbar()

const router = useRouter()
const loading = ref(false)
const centrosSalud = ref([]);
const loadingCentros = ref(false);

onMounted(async () => {
    try {
    loadingCentros.value = true;
    const response = await axios.get('/api/v1/vaccination-centers');
    centrosSalud.value = response.data;
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al cargar los centros de salud: ${msg}`);
    } finally {
    loadingCentros.value = false;
    }
});

// Validaciones
const { handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required('El nombre es requerido').min(1, "Debe contener minimo 1 letras").matches(/^[a-zA-ZñÑ ]+$/, 'Solo letras y espacios'),
        lastname: yup.string().required('El apellido es requerido').min(1, "Debe contener minimo 1 letras").matches(/^[a-zA-ZñÑ ]+$/, 'Solo letras y espacios'),
        role: yup.string().required('El rol es requerido'),
        email: yup.string().matches(/^[\w-.]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/, 'Solo se permiten correos de Gmail, Outlook, Yahoo o Hotmail').required('El correo electrónico es requerido'),
        password: yup.string().required('La contraseña es requerida').min(6,"Debe contener minimo 6 letras"),
        vaccinationCenterId: yup.string()
        .when('role', {
        is: 'health',
        then: schema => schema.required('El centro de salud es requerido para personal de salud'),
        otherwise: schema => schema.notRequired()
        })
    })
}); 

// Manejo de errores
const {value: name, errorMessage: nameError} = useField("name")
const {value: lastname, errorMessage: lastnameError} = useField("lastname")
const {value: role, errorMessage: roleError} = useField("role")
const {value: email, errorMessage: emailError} = useField("email")
const {value: password, errorMessage: passwordError} = useField("password")
const {value: vaccinationCenterId, errorMessage: vaccinationCenterIdError} = useField("vaccinationCenterId")

// Envio
const registro = handleSubmit(async (values) => {
    try {
        loading.value = true

        await axios.post('/api/v1/users', {
        name: values.name,
        lastname: values.lastname,
        role: values.role,
        email: values.email,
        password: values.password,
        vaccinationCenterId: values.vaccinationCenterId
        }
        );

        $snackbar.success('¡Registro exitoso!', {
        timeout: 5000,
        actions: [
            {
            text: 'Ir al login',
            onClick: () => router.push('/login')
            }
        ]
        });

    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al registrar el el usuario: ${msg}`);
    } finally {
        loading.value = false;
    }
});
</script>
