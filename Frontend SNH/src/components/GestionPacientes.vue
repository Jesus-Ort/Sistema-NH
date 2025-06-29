<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <div class="mb-8">
            <h3 class="mb-4">Gestion de Pacientes:</h3>
            <p>En esta sección podrás gestionar a los pacientes.</p>
            <p>Podrás ver, editar y eliminar a los pacientes.</p>
            </div>
            <!-- Campo de búsqueda -->
            <v-text-field
            v-model="busqueda"
            label="Buscar por nombre, cédula, representante..."
            prepend-inner-icon="mdi-magnify"
            clearable
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
                :items="pacientesFiltrados"
                :loading="loading"
                loading-text="Cargando pacientes..."
                class="elevation-1"
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
                <v-btn icon color="warning" class="mb-1 mt-1" @click="abrirModal(item)">
                    <v-icon class="text-white">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="error" class="mb-1 mt-1" @click="prepararEliminacion(item)">
                    <v-icon class="text-white">mdi-delete</v-icon>
                </v-btn>
                </template>
            </v-data-table>
            </div>
        </v-col>
        </v-row>

        <!-- Modal de edición -->
        <v-dialog v-model="modal" max-width="600px">
        <v-card>
            <v-card-title>Editar Paciente</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="validarYGuardar">
                <!-- Checbox para saber si tiene cedula o no -->
                <v-checkbox
                v-model="form.isChild"
                label="¿Sin cédula?"
                />
                <p v-if="form.isChild" class="mb-2 text-warning">
                Si no tiene cédula, debe seleccionar un representante. 
                </p>
                <p v-if="form.isChild" class="mb-2 text-warning">
                La "Cédula" que se muestra es un ididentificador proporcionado por el sistema.
                </p>
                <p v-if="form.isChild" class="mb-2 text-warning">
                Solo actualizar ese iddentificador cuando ya tenga su propia cédula.
                </p>
                <p v-if="form.isChild" class="mb-10 text-warning">
                    Las Cedulas proporcionadas por el sistema inician en 999
                </p>

                <!-- Nombre -->
                <v-text-field
                v-model="form.firstName"
                label="Nombre"
                :error-messages="errors.firstName"
                required
                clearable
                prepend-icon="mdi-account"
                color="text"
                />

                <!-- Apellido -->
                <v-text-field
                v-model="form.lastname"
                label="Apellido"
                color="text"
                :error-messages="errors.lastname"
                required
                clearable
                prepend-icon="mdi-account-box"
                />

                <!-- Cédula -->
                <v-text-field
                v-model="form.identityDocument"
                label="Cédula"
                :error-messages="errors.identityDocument"
                required
                clearable
                prepend-icon="mdi-card"
                color="text"
                />

                <!-- Representante -->
                <v-select
                v-if="form.isChild"
                v-model="form.representativeId"
                :items="representantes"
                item-title="nombreCompleto"
                item-value="id"
                label="Representante"
                :error-messages="errors.representativeId"
                clearable
                prepend-icon="mdi-account"
                color="text"
                />

                <!-- Teléfono Móvil -->
                <v-text-field
                v-model="form.mobilePhone"
                label="Teléfono"
                :error-messages="errors.mobilePhone"
                clearable
                prepend-icon="mdi-phone"
                color="text"
                />

                <!-- Dirección -->
                <v-text-field
                v-model="form.address"
                label="Dirección"
                :error-messages="errors.address"
                clearable
                color="text"
                prepend-icon="mdi-home"
                />

                <!-- Botones Modal -->
                <v-card-actions>
                <v-spacer />
                <v-btn text @click="modal = false " :disabled="loading">Cancelar</v-btn>
                <v-btn color="text" @click="validarYGuardar" :disabled="loading">Guardar</v-btn>
                </v-card-actions>
            </v-form>
            </v-card-text>
        </v-card>
        </v-dialog>

        <ConfirmDialog
        v-model="mostrarDialogo"
        title="Confirmar eliminación"
        :message="mensajeDialogo"
        @confirm="confirmarEliminacion"
        :disabled="loading"
        />
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/services/axios'
import { useSnackbar } from '@/composables/useSnackbar'
import { useDarkMode } from '@/composables/useDarkMode'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import * as yup from 'yup'

const $snackbar = useSnackbar()
const { isDark } = useDarkMode()

const pacientes = ref([])
const representantes = ref([])
const loading = ref(false)
const modal = ref(false)
const mostrarDialogo = ref(false)
const pacienteBorrar = ref({})
const busqueda = ref('')
const form = ref({
    id: null,
    firstName: '',
    lastname: '',
    identityDocument: '',
    isChild: false,
    representativeId: null,
    mobilePhone: '',
    address: ''
})
const errors = ref({})

const schema = yup.object({
    firstName: yup.string().required('El nombre es requerido').min(2, 'Mínimo 2 letras').matches(/^[a-zA-ZñÑ ]+$/, 'Solo letras y espacios'),
    lastname: yup.string().required('El apellido es requerido').min(2, 'Mínimo 2 letras').matches(/^[a-zA-ZñÑ ]+$/, 'Solo letras y espacios'),
    identityDocument: yup.string().required('La cédula es requerida').min(6, 'Mínimo 6 caracteres').matches(/^\d+$/, 'Solo números'),
    mobilePhone: yup.string().nullable().matches(/^$|^\d{11}$/, 'El teléfono debe tener 11 números'),
    address: yup.string().nullable().min(5, 'Mínimo 5 caracteres').matches(/^[a-zA-Z0-9 _-]+$/, 'Solo pueden ser letras, números y signos ( - _ )'),
    representativeId: yup.string().nullable().when('isChild', {
        is: true,
        then: s => s.required('El representante es requerido')
    })
})

// Valida para guardar correctamente 
const validarYGuardar = async () => {
    try {
        await schema.validate(form.value, { abortEarly: false })
        errors.value = {}
        guardarCambios()
    } catch (err) {
        const e = {}
        err.inner.forEach(er => {
        e[er.path] = er.message
        })
        errors.value = e
    }
}

// Validación en tiempo real con Yup
watch(form, async (nuevo) => {
    try {
        await schema.validate(nuevo, { abortEarly: false })
        errors.value = {}
    } catch (err) {
        const e = {}
        err.inner.forEach(er => {
            e[er.path] = er.message
        })
        errors.value = e
    }
}, { deep: true })

// Titulos en la tabla
const headers = [
    { title: 'Nombre', value: 'nombreCompleto', align: 'center' },
    { title: 'Cédula', value: 'identityDocument', align: 'center' },
    { title: 'Representante', value: 'representante', align: 'center' },
    { title: 'Teléfono', value: 'mobilePhone', align: 'center' },
    { title: 'Dirección', value: 'address', align: 'center' },
    { title: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
]

// Cargar a la tabla todos los pacientes
const obtenerPacientes = async () => {
    try {
        loading.value = true
        const res = await axios.get('/api/v1/patients')
        pacientes.value = res.data
        .filter(p => p.isActive !== false)
        .map(p => ({
            id: p.id,
            nombreCompleto: `${p.firstName} ${p.lastname}`.trim(),
            identityDocument: p.isChild 
            ? p.representative 
                ? 'No aplica'
                : `CI ${p.identityDocument}`
            : `CI ${p.identityDocument}`,
            representante: p.isChild
            ? p.representative
                ? `CI ${p.representative.identityDocument}`
                : 'Sin representante'
            : 'No aplica',
            mobilePhone: p.mobilePhone || 'N/A',
            address: p.address || 'N/A',
            raw: p
        }))
        representantes.value = res.data
        .filter(p => !p.isChild)
        .map(p => ({
            id: p.id,
            nombreCompleto: `${p.firstName} ${p.lastname} (CI ${p.identityDocument})`
        }))
    } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar pacientes'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Al cargar el componente se cargan los pacientes
onMounted(() => {
    obtenerPacientes()
})

// Modal para la edicion
const abrirModal = (item) => {
    const raw = item.raw
    form.value = {
        id: raw.id,
        firstName: raw.firstName,
        lastname: raw.lastname,
        identityDocument: raw.identityDocument,
        isChild: raw.isChild,
        representativeId: raw.representativeId,
        mobilePhone: raw.mobilePhone,
        address: raw.address
    }
    modal.value = true
}

// Guardar cambios
const guardarCambios = async () => {
    try {
        loading.value = true
        const data = {
        firstName: form.value.firstName,
        lastname: form.value.lastname,
        identityDocument: form.value.identityDocument,
        isChild: form.value.isChild,
        representativeId: form.value.isChild ? form.value.representativeId : null,
        mobilePhone: form.value.mobilePhone,
        address: form.value.address
        }
        await axios.patch(`/api/v1/patients/${form.value.id}`, data)
        $snackbar.success('Paciente actualizado correctamente')
        modal.value = false
        obtenerPacientes()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al guardar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Prepara el borrado, carga la informacion del paciente y pregunta si lo quieres borrar
const prepararEliminacion = (item) => {
    pacienteBorrar.value = item
    mostrarDialogo.value = true
}

// Luego de la consulta, se confirma la eliminacion
const confirmarEliminacion = async () => {
    try {
        loading.value = true
        await axios.patch(`/api/v1/patients/${pacienteBorrar.value.id}`, { isActive: false })
        $snackbar.success('Paciente eliminado correctamente')
        mostrarDialogo.value = false
        obtenerPacientes()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al eliminar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Mensaje del dialogo donde pregunta si quieres borrar el paciente
const mensajeDialogo = computed(() => {
    return pacienteBorrar.value?.nombreCompleto
    ? `¿Deseas eliminar al paciente ${pacienteBorrar.value.nombreCompleto}?`
    : '¿Deseas eliminar este paciente?'
})

// Normalizar texto para la tabla
const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const pacientesFiltrados = computed(() => {
    const texto = normalizar(busqueda.value)
    return pacientes.value.filter(p =>
        normalizar(p.nombreCompleto).includes(texto) ||
        normalizar(p.identityDocument).includes(texto) ||
        normalizar(p.representante).includes(texto) ||
        normalizar(p.mobilePhone).includes(texto) ||
        normalizar(p.address).includes(texto)
    )
    })
</script>
