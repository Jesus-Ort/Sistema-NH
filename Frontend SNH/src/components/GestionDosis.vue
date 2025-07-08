<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <div class="mb-8">
            <h3 class="mb-4">Gestion de Dosis:</h3>
            <p>En esta sección podrás gestionar las Dosis aplicadas a los pacientes.</p>
            <p>Podrás ver, editar y eliminar las Dosis aplicadas.</p>
            </div>
            <!-- Campo de búsqueda -->
            <v-text-field
            v-model="busqueda"
            label="Buscar vacuna, paciente, centro, fecha, etc."
            prepend-inner-icon="mdi-magnify"
            clearable
            :color="isDark ? 'text' : 'text'"
            :theme="isDark ? 'SNHdark' : 'SNH'"
            class="mb-4"
            />
        </v-col>
        </v-row>

        <v-row>
        <v-col cols="12">
            <!-- Tabla con scroll horizontal en móviles -->
            <div style="overflow-x: auto;">
            <v-data-table
                :headers="headers"
                :items="dosisFiltradas"
                :loading="loading"
                loading-text="Cargando Dosis..."
                class="elevation-1"
                :items-per-page-text="'Ítems por páginas'"
                :style="{
                background: isDark ? '#23272f' : '#eee',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                minWidth: '600px'  
                }"
            >
            <!-- Botones Tabla -->
                <template #item.acciones="{ item }">
                <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                    <v-btn icon color="warning" class="mb-1 mt-1" @click="abrirModal(item)">
                        <v-icon class="text-white">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        color="error"
                        class="mb-1 mt-1"
                        @click="prepararEliminacion(item)"
                    >
                        <v-icon class="text-white">mdi-delete</v-icon>
                    </v-btn>
                </div>     
                </template>
            </v-data-table>
            </div>
        </v-col>
        </v-row>

        <!-- Modal de edición -->
        <v-dialog v-model="modal" max-width="90%">
        <v-card>
            <v-card-title>Editar Dosis</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="guardarCambios" ref="formRef" v-slot="{ validate }">
                <!-- Dosis -->
                <v-select
                v-model="form.vaccineBatchId"
                :items="vaccineBatches"
                item-title="vaccineName"
                item-value="id"
                label="Vacuna y Lote"
                :loading="loadingLotes"
                :disabled="loadingLotes"
                color="text"
                :error-messages="errors.vaccineBatchId"
                @blur="validateField('vaccineBatchId')"
                />

                <!-- Paciente -->
                <v-select
                v-model="form.patientId"
                :items="pacientes"
                item-title="nombreCompleto"
                item-value="id"
                label="Paciente"
                :loading="loadingPacientes"
                :disabled="loadingPacientes"
                color="text"
                :error-messages="errors.patientId"
                @blur="validateField('patientId')"
                />

                <!-- Personal de salud que aplicó la dosis -->
                <v-select
                v-model="form.applyingUserId"
                :items="personal"
                item-title="nombreCompleto"
                item-value="id"
                label="Personal que aplicó la dosis"
                :loading="loadingPersonal"
                :disabled="loadingPersonal"
                color="text"
                :error-messages="errors.applyingUserId"
                @blur="validateField('patientId')"
                />

                <!-- Centro de Salud -->
                <v-select
                v-model="form.vaccinationCenterId"
                :items="centros"
                item-title="centerName"
                item-value="id"
                label="Centro de Salud"
                :loading="loadingCentros"
                :disabled="loadingCentros"
                color="text"
                :error-messages="errors.vaccinationCenterId"
                @blur="validateField('vaccinationCenterId')"
                />

                <!-- Número de la dosis -->
                <v-number-input
                label="Dosis"
                v-model="form.dosis"
                type="number"
                control-variant="hidden"
                :error-messages="errors.dosis"
                @blur="validateField('dosis')"
                />

                <!-- Observación -->
                <v-text-field
                label="Observación"
                v-model="form.observacion"
                :error-messages="errors.observacion"
                @blur="validateField('observacion')"
                />
            </v-form>
            </v-card-text>
            <!-- Botones Modal -->
            <v-card-actions>
            <v-spacer />
            <v-btn text @click="modal = false" :disabled="loading">Cancelar</v-btn>
            <v-btn color="text" @click="guardarCambios" :disabled="loading">Guardar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <ConfirmDialog
        v-model="mostrarDialogo"
        title="Confirmar"
        :message="mensajeDialogo"
        @confirm="confirmarEliminacion"
        :disabled="loading"
        />
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import * as yup from 'yup'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useDarkMode } from '@/composables/useDarkMode'
import axios from '@/services/axios'
import { useSnackbar } from '@/composables/useSnackbar'

const $snackbar = useSnackbar()
const { isDark } = useDarkMode()
const dosis = ref([])
const loading = ref(true)
const loadingLotes = ref(true)
const loadingPacientes = ref(true)
const loadingCentros = ref(true)
const loadingPersonal = ref(true)
const modal = ref(false)
const mostrarDialogo = ref(false)
const dosisBorrar = ref({})
const form = reactive({
    id: null,
    dosis: null,
    observacion: '',
    vaccineBatchId: null,
    patientId: null,
    vaccinationCenterId: null,
    applyingUserId: null
})
const errors = reactive({
    dosis: null,
    observacion: null,
    vaccineBatchId: null,
    patientId: null,
    vaccinationCenterId: null
})
const busqueda = ref('')
const vaccineBatches = ref([])
const pacientes = ref([])
const centros = ref([])
const personal = ref([])

// Titulos de la Tabla
const headers = [
    { title: 'Vacuna', value: 'vacuna', align: 'center' },
    { title: 'Paciente', value: 'paciente', align: 'center' },
    { title: 'Personal De Salud', value: 'personal', align: 'center' },
    { title: 'Fecha', value: 'fecha', align: 'center' },
    { title: 'Dosis', value: 'dosis', align: 'center' },
    { title: 'Centro de Salud', value: 'centro', align: 'center' },
    { title: 'Observación', value: 'observacion', sortable: false, align: 'center' },
    { title: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
]

const schema = yup.object({
    vaccineBatchId: yup.string().required('La vacuna es requerida'),
    patientId: yup.string().required('El paciente es requerido'),
    vaccinationCenterId: yup.string().required('El centro de salud es requerido'),
    dosis: yup
        .number()
        .required('La dosis es requerida')
        .min(1, 'La dosis debe ser al menos 1')
        .typeError('La dosis debe ser un número'),
    observacion: yup.string().notRequired()
})

// Normalizar texto de la tabla
const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const dosisFiltradas = computed(() => {
    const texto = normalizar(busqueda.value)
    return dosis.value.filter(v => (
        normalizar(v.vacuna || '').includes(texto) ||
        normalizar(v.paciente || '').includes(texto) ||
        normalizar(v.personal || '').includes(texto) ||
        normalizar(v.centro || '').includes(texto) ||
        normalizar(v.fecha || '').includes(texto) ||
        normalizar(String(v.dosis || '')).includes(texto)
    ))
})

// Obtener las Dosis aplicadas
const obtenerDosis = async () => {
    try {
        loading.value = true
        const response = await axios.get('/api/v1/applied-doses')
        dosis.value = response.data
        .filter(v => v.isActive !== false)
        .map(v => ({
            id: v.id,
            vacuna: v.vaccineBatch?.vaccine?.vaccineName || 'Desconocida',
            paciente: v.patient
            ? `${v.patient.firstName} ${v.patient.lastname}`.trim() + (
                v.patient.isChild 
                    ? ` (Hijo de: CI ${v.patient.representative?.identityDocument || 'Desconocido'})`
                    : ` CI: ${v.patient.identityDocument || 'N/A'}`
                )
            : 'Desconocido',
            personal:v.applyingUser ? `${v.applyingUser.name} ${v.applyingUser.lastname}` + ` Correo: ${v.applyingUser.email}`: 'N/A',
            centro: v.vaccinationCenter?.centerName || 'Desconocido',
            dosis: v.doseNumber,
            fecha: v.applicationDateTime ? v.applicationDateTime.split('T')[0] : 'N/A',
            observacion: v.observations || '',
            raw: v
        }))
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al cargar las Dosis'
        $snackbar.error(`Algo salió mal al cargar las Dosis: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Al montarse el componente se cargan las vacunas, lotes, pacientes y centros
onMounted(async () => {
    obtenerDosis()
})

// Cargar Lotes
const cargarVaccineBatches = async () => {
    try {
        loadingLotes.value = true
        const res = await axios.get('/api/v1/vaccine-batches')
        vaccineBatches.value = res.data.map(vb => ({
        id: vb.id,
        vaccineName: vb.vaccine.vaccineName + ' (Lote ' + vb.batchNumber + ')'
        }))
    } catch (error) {
        const msg = error.response?.data?.message || 'Error al cargar lotes de vacunas'
        $snackbar.error(`Algo salió mal al cargar lotes: ${msg}`)
    } finally{
        loadingLotes.value = false
    }
}

// Cargar Pacientes
const cargarPacientes = async () => {
    try {
        loadingPacientes.value = true
        const res = await axios.get('/api/v1/patients')
        pacientes.value = res.data.map(p => {
        let nombreCompleto = `${p.firstName} ${p.lastname}`.trim()
        if (p.isChild) {
            const ciPadre = p.representative?.identityDocument || 'Desconocido'
            nombreCompleto += ` (Hijo de: CI ${ciPadre})`
        }
        return {
            id: p.id,
            nombreCompleto
        }
        })
    } catch (error) {
        const msg = error.response?.data?.message || 'Error al cargar pacientes'
        $snackbar.error(`Algo salió mal al cargar pacientes: ${msg}`)
    } finally{
        loadingPacientes.value = false
    }
}

// Cargar Centros de Salud
const cargarCentros = async () => {
    try {
        loadingCentros.value = true
        const res = await axios.get('/api/v1/vaccination-centers')
        centros.value = res.data
    } catch (error) {
        const msg = error.response?.data?.message || 'Error al cargar los Centros de Salud'
        $snackbar.error(`Algo salió mal al cargar los Centros de Salud: ${msg}`)
    } finally{
        loadingCentros.value = false
    }
}

// Cargar personal (usuarios)
const cargarPersonal = async () => {
    try {
        loadingPersonal.value = true
        const res = await axios.get('/api/v1/users')
        personal.value = res.data.map(p => {
        let nombreCompleto = `${p.name} ${p.lastname}`.trim() + ` Correo: ${p.email}` 
        return {
            id: p.id,
            nombreCompleto
        }
        })
    } catch (error) {
        const msg = error.response?.data?.message || 'Error al cargar el Personal de Salud'
        $snackbar.error(`Algo salió mal al cargar el Personal de Salud: ${msg}`)
    } finally{
        loadingPersonal.value = false
    }
}

// Modal
const abrirModal = (item) => {
    form.id = item.id
    form.dosis = item.dosis
    form.observacion = item.observacion
    form.vaccineBatchId = item.raw.vaccineBatchId
    form.patientId = item.raw.patientId
    form.vaccinationCenterId = item.raw.vaccinationCenterId
    form.applyingUserId = item.raw.applyingUserId

    // Limpiar errores
    Object.keys(errors).forEach(key => errors[key] = null)

    modal.value = 
    // Cargar datos: lote, pacientes, centros, personal
    cargarVaccineBatches()
    cargarPacientes()
    cargarCentros()
    cargarPersonal()
}

const validateField = async (field) => {
    try {
        await schema.validateAt(field, form)
        errors[field] = null
    } catch (e) {
        errors[field] = e.message
    }
}

// Validar el formulario 
const validarFormulario = async () => {
    try {
        await schema.validate(form, { abortEarly: false })
        Object.keys(errors).forEach(key => errors[key] = null)
        return true
    } catch (e) {
        e.inner.forEach(err => {
        errors[err.path] = err.message
        })
        return false
    }
}

// Guardar cambios 
const guardarCambios = async () => {
    if (!(await validarFormulario())) return

    try {
        loading.value = true
        if (form.id) {
        const data = {
            doseNumber: Number(form.dosis),
            observations: form.observacion || '',
            patientId: form.patientId,
            vaccineBatchId: form.vaccineBatchId,
            vaccinationCenterId: form.vaccinationCenterId,
            applyingUserId: form.applyingUserId
        }
        const response = await axios.patch(`/api/v1/applied-doses/${form.id}`, data)

        if (response.data.rolledBack) {
            $snackbar.warning(response.data.message || 'El sistema revirtió los cambios por seguridad')
        } else {
            $snackbar.success('Vacuna actualizada correctamente')
        }
        }
        modal.value = false
        obtenerDosis()
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al guardar los cambios'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Prepara la eliminacion
const prepararEliminacion = (item) => {
    dosisBorrar.value = item
    mostrarDialogo.value = true
}

// Luego de consultar si desea borrar, se confirma
const confirmarEliminacion = async () => {
    try {
        loading.value = true
        const response = await axios.patch(
        `/api/v1/applied-doses/cancel/${dosisBorrar.value.raw.id}`)
        if (response.data.rolledBack) {
        $snackbar.warning(response.data.message || 'El sistema revirtió la eliminación por seguridad')
        } else {
        $snackbar.success('Dosis eliminada correctamente')
        }

        mostrarDialogo.value = false
        obtenerDosis()
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al eliminar la Dosis'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}
// Mensaje del dialogo donde pregunta si desea borrar
const mensajeDialogo = computed(() => {
    return dosisBorrar.value?.paciente
        ? `¿Deseas borrar la Dosis aplicada a ${dosisBorrar.value.paciente}?`
        : '¿Deseas borrar esta Dosis?'
})
</script>
