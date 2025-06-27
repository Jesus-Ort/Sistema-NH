<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
            <v-form class="pa-4">
                <h2 class="text-center text-h4 mb-4 w-full">Registro De Pacientes</h2>
                <p class="text-center mb-4">Por favor ingresa los datos para el registro del paciente.</p>

                <!-- Paciente sin cédula -->
                <v-checkbox
                    class="mt-4 color-text"
                    v-model="sinCedula"
                    label="Paciente sin cédula (menor de edad)"
                    color="text"
                ></v-checkbox>

                <!-- Cédula de Identidad -->
                <v-text-field
                    v-if="!sinCedula"
                    class="mt-4"
                    v-model="nationalID"
                    clearable
                    label="Cédula de Identidad del paciente"
                    color="text"
                    required
                    :error-messages="cedulaError"
                    prepend-icon="mdi-card"
                ></v-text-field>

                <!-- Cédula del Representante -->
                <v-autocomplete
                    v-if="sinCedula"
                    class="mt-4"
                    v-model="representativeId"
                    :items="representantesFiltrados"
                    item-title="identityDocument"
                    :item-value="'id'"
                    :loading="loadingRepresentante"
                    :rules="[val => !!val || 'Debe seleccionar una cédula válida']"
                    return-id
                    clearable
                    label="Cédula del representante"
                    color="text"
                    required
                    :error-messages="representativeIdError"
                    prepend-icon="mdi-card"
                />
                <p v-if="sinCedula" class="text-center mb-4 text-warning">Asegurate de que el padre ya se encuentre registrado como paciente</p>

                <!-- Nombre -->
                <v-text-field
                    class="mt-4"
                    v-model="firstName"
                    clearable
                    label="Nombre"
                    color="text"
                    required
                    :error-messages="firstNameError"
                    prepend-icon="mdi-account"
                />

                <!-- Apellido -->
                <v-text-field
                    class="mt-4"
                    v-model="lastName"
                    clearable
                    label="Apellido"
                    color="text"
                    required
                    :error-messages="lastNameError"
                    prepend-icon="mdi-account-box"
                />

                <!-- Fecha de Nacimiento -->
                <v-text-field
                    class="mt-4"
                    v-model="birthDate"
                    clearable
                    label="Fecha de Nacimiento"
                    type="date"
                    color="text"
                    required
                    :error-messages="birthDateError"
                    prepend-icon="mdi-calendar"
                />

                <!-- Dirección -->
                <v-text-field
                    class="mt-4"
                    v-model="address"
                    clearable
                    label="Dirección"
                    color="text"
                    required
                    :error-messages="addressError"
                    prepend-icon="mdi-home"
                />

                <!-- Teléfono -->
                <v-text-field
                    class="mt-4"
                    v-model="phone"
                    clearable
                    label="Teléfono"
                    color="text"
                    required
                    :error-messages="phoneError"
                    prepend-icon="mdi-phone"
                />

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
                    prepend-icon="mdi-email"
                />

                <div class="d-flex justify-end mt-4">
                    <v-btn
                    @click="registro()"
                    block
                    :loading="loading"
                    :disabled="loading"
                    color="success"
                    >
                    Registrar
                    </v-btn>
                </div>
                </v-form>
        </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { ref, computed, onMounted, watch } from 'vue';
import axios from '@/services/axios';
import { useSnackbar } from '@/composables/useSnackbar';

const $snackbar = useSnackbar();
const loading = ref(false);
const sinCedula = ref(false);
const loadingRepresentante = ref(false)
const representantes = ref([]);

watch(sinCedula, (val) => {
    if (!val) {
        representativeId.value = null;
    } else {
        nationalID.value = '';
    }
});

const generarIdentificadorUnicoParaMenor = () => {
    return `999${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
}

const cargarRepresentantes = async () => {
    try {
        loadingRepresentante.value = true;
        const response = await axios.get('/api/v1/patients');
        representantes.value = response.data;
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al cargar los representantes: ${msg}`);
    } finally {
        loadingRepresentante.value = false;
    }
}

onMounted(cargarRepresentantes);

const { handleSubmit } = useForm({
    validationSchema: computed(() => {
        return yup.object({
        firstName: yup
            .string()
            .required('El nombre es requerido')
            .min(1, 'Debe contener mínimo 1 letra')
            .matches(/^[a-zA-ZñÑ ]+$/, 'Solo letras y espacios'),
        lastName: yup
            .string()
            .required('El apellido es requerido')
            .min(1, 'Debe contener mínimo 1 letra')
            .matches(/^[a-zA-ZñÑ ]+$/, 'Solo letras y espacios'),
        birthDate: yup
            .date()
            .typeError('Debe ser una fecha correcta')
            .required('La fecha de nacimiento es requerida')
            .max(new Date(), 'La fecha de nacimiento no puede ser futura'),
        address: yup
            .string()
            .required('La dirección es requerida')
            .min(1, 'Debe contener mínimo 1 letra')
            .matches(/^[a-zA-Z0-9 _-]+$/, 'Solo pueden ser letras, números y signos ( - _ )'),
        phone: yup
            .string()
            .required('El teléfono es requerido')
            .min(11, 'Debe contener mínimo 11 números')
            .matches(/^[0-9]+$/, 'Solo pueden ser números'),
        email: yup
            .string()
            .required('El correo electrónico es requerido')
            .matches(
            /^[\w-.]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/,
            'Solo se permiten correos de Gmail, Outlook, Yahoo o Hotmail'
            ),
        nationalID: sinCedula.value
            ? yup.string().notRequired()
            : yup
                .string()
                .required('La cédula del paciente es requerida')
                .matches(/^\d{6,9}$/, 'Debe contener entre 6 y 9 dígitos'),
        representativeId: sinCedula.value
            ? yup
                .string()
                .required('La cédula del representante es requerida')
            : yup.string().notRequired()
        });
    })
});

const { value: firstName, errorMessage: firstNameError } = useField('firstName');
const { value: lastName, errorMessage: lastNameError } = useField('lastName');
const { value: birthDate, errorMessage: birthDateError } = useField('birthDate');
const { value: address, errorMessage: addressError } = useField('address');
const { value: phone, errorMessage: phoneError } = useField('phone');
const { value: email, errorMessage: emailError } = useField('email');
const { value: nationalID, errorMessage: cedulaError } = useField('nationalID');
const { value: representativeId, errorMessage: representativeIdError } = useField('representativeId');

const representantesFiltrados = computed(() => {
    return representantes.value.filter(rep => rep.isChild === false);
});

const registro = handleSubmit(async (values) => {
    try {
        loading.value = true;

        const identity = sinCedula.value
            ? generarIdentificadorUnicoParaMenor()
            : values.nationalID;

        const payload = {
            firstName: values.firstName,
            lastname: values.lastName,
            email: values.email,
            address: values.address,
            mobilePhone: values.phone,
            dateOfBirth: values.birthDate,
            identityDocument: identity,
            representativeId: sinCedula.value ? values.representativeId : null,
            isChild: sinCedula.value
        };

        await axios.post('/api/v1/patients', payload);

        $snackbar.success('¡Registro exitoso!');
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al registrar el paciente: ${msg}`);
    } finally {
        cargarRepresentantes();
        loading.value = false;
    }
});
</script>
