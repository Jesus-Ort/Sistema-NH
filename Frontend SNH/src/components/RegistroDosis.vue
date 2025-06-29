<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-form class="pa-4">
        
                    <h2 class="text-center text-h4 mb-4 w-full">Dosis</h2>
        
                    <p class="text-center mb-4">Porfavor ingresa los datos de la dosis.</p>
        
                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- Paciente -->
                    <v-autocomplete
                        class="mt-4"
                        v-model="paciente"
                        :items="pacientes"
                        :loading="loadingAll"
                        :disabled="loadingAll"
                        :item-title="pacienteLabel"
                        :item-value="'id'"
                        return-id 
                        label="C.I del Paciente"
                        color="text"
                        required
                        :error-messages="pacienteError"
                        prepend-icon="mdi-human">
                    </v-autocomplete>
                    
                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!--Numero de Lote -->
                    <v-autocomplete
                        class="mt-4"
                        v-model="lote"
                        :items="lotes"
                        :loading="loadingAll"
                        :disabled="loadingAll"
                        item-title="batchNumber"
                        :item-value="'id'"
                        :rules="[val => !!val || 'Debe seleccionar un lote válido']"
                        return-id
                        label="Numero del Lote"
                        color="text"
                        required
                        :error-messages="loteError"
                        prepend-icon="mdi-package-variant">
                    </v-autocomplete>
        
                    <!-- Numero de dosis -->
                    <v-number-input 
                        class="mt-4"
                        v-model="doseNumber"
                        clearable
                        label=" Número de la dosis"
                        required
                        color="text"
                        :error-messages="doseNumberError"
                        prepend-icon="mdi-needle"
                        control-variant="hidden"
                    ></v-number-input>
        
                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- Centro de Salud -->
                    <v-select
                        class="mt-4"
                        v-model="vaccinationCenterId"
                        :items="centrosSalud"
                        item-title="centerName"
                        :item-value="'id'"
                        :loading="loadingAll"
                        :disabled="loadingAll"
                        :rules="[val => !!val || 'Debe seleccionar un centro de salud válido']"
                        return-id
                        label="Centro de Salud"
                        color="text"
                        :error-messages="vaccinationCenterIdError"
                        prepend-icon="mdi-hospital-building">
                    </v-select>

                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- Nombre del profesional de salud que aplicó la dosis -->                  
                    <v-autocomplete
                        class="mt-4"
                        v-model="healthProfessional"
                        :items="usuarios"
                        :item-title="salud"
                        :item-value="'id'"
                        :loading="loadingAll"
                        :disabled="loadingAll"
                        :rules="[val => !!val || 'Debe seleccionar un profesional de salud válido']"
                        return-id
                        label="Nombre de quién aplicó la dosis"
                        required
                        color="text"
                        :error-messages="healthProfessionalError"
                        prepend-icon="mdi-stethoscope"
                    ></v-autocomplete>
        
                    <!-- Observaciones -->
                    <v-text-field
                        class="mt-4"
                        v-model="observaciones"
                        clearable
                        label="Observaciones"
                        required
                        color="text"
                        :error-messages="observacionesError"
                        prepend-icon="mdi-eye"
                    ></v-text-field>
        
                    <div class="d-flex justify-end mt-4">
                        <v-btn 
                        @click="registro()"
                        :loading="loadingButton"
                        :disabled="loadingButton" 
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
import axios from '@/services/axios';
import * as yup from 'yup'
import { useSnackbar } from '@/composables/useSnackbar'

const $snackbar = useSnackbar()

const loadingButton = ref(false)
const centrosSalud = ref([]);
const lotes = ref([]);
const pacientes = ref([]);
const usuarios = ref([]);
const loadingAll = ref(false);

onMounted(async () => {
    try {
        loadingAll.value = true;

    const [centrosResp, lotesResp, pacientesResp, usersResp] = await Promise.all([
        axios.get('/api/v1/vaccination-centers'),
        axios.get('/api/v1/vaccine-batches'),
        axios.get('/api/v1/patients'),
        axios.get('/api/v1/users')
        ]);

        // Asignamos las respuestas a sus refs
        centrosSalud.value = centrosResp.data;
        lotes.value = lotesResp.data;
        pacientes.value = pacientesResp.data;
        usuarios.value = usersResp.data;

    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al cargar los datos';
        $snackbar.error(`Algo salió mal: ${msg}`);
    } finally {
        loadingAll.value = false;
    }
    });

// Validaciones
const { handleSubmit } = useForm({
    validationSchema: yup.object({
        paciente: yup.string().required("El paciente es requerido").min(3,"Debe contener minimo 3 letras"),
        lote: yup.string().required('El número de lote es requerido').min(3,"Debe contener minimo 3 letras"),
        doseNumber: yup.number().required("El número de la dosis aplicada es requerido").min(1,"Debe ser al menos 1 dosis"),
        vaccinationCenterId: yup.string().required("El centro de salud es requerido"),
        healthProfessional: yup.string().required("El Profesional de Salud es requerido"),
        observaciones: yup.string().max(1000,"Máximo 1000 letras").matches(/^[a-zA-Z0-9 _-]+$/, 'Solo pueden ser letras, números y signos ( - _ )')
    })
}); 

// Manejo de errores
const {value: doseNumber, errorMessage: doseNumberError} = useField("doseNumber")
const {value: observaciones, errorMessage: observacionesError} = useField("observaciones")
const {value: paciente, errorMessage: pacienteError} = useField("paciente")
const {value: lote, errorMessage: loteError} = useField("lote")
const {value: vaccinationCenterId, errorMessage: vaccinationCenterIdError} = useField("vaccinationCenterId")
const {value: healthProfessional, errorMessage: healthProfessionalError} = useField("healthProfessional")

const salud = (item) => {
    if (!item) return '';
return `${item.name} ${item.lastname } (${item.email})`

};

const pacienteLabel = (item) => {
    if (!item) return '';

    if (item.isChild && item.representative && item.representative.identityDocument) {
    return `${item.firstName} ${item.lastname} - C.I ${item.representative.identityDocument} (Hijo sin C.I)`;
    }

    return `${item.firstName} ${item.lastname} - C.I ${item.identityDocument}`;
};

// Envio
const registro = handleSubmit( async (values) => {
    try {
    loadingButton.value = true;
    await axios.post('/api/v1/applied-doses', {
        doseNumber: values.doseNumber,
        observations: values.observaciones,
        patientId: values.paciente,
        vaccineBatchId: values.lote,
        vaccinationCenterId: values.vaccinationCenterId,
        applyingUserId: values.healthProfessional
    });

    $snackbar.success('¡Registro exitoso!');
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al registrarse';
        $snackbar.error(`Algo salió mal al registrar la dosis: ${msg}`);
    } finally {
        loadingButton.value = false;
    }
}); 

</script>
