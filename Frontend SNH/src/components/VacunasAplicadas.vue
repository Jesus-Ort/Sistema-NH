<!--
    VacunasAplicadas.vue

    Componente Vue para mostrar, buscar, editar y eliminar registros de 
    vacunas aplicadas a pacientes.
    Utiliza Vuetify para la interfaz de usuario y un modal de 
    confirmación personalizado.

    Funcionalidades principales:
    - Visualización de una tabla de vacunas aplicadas con scroll horizontal en móviles.
    - Búsqueda dinámica por vacuna, paciente, centro, fecha o dosis.
    - Edición de registros mediante un modal.
    - Eliminación de registros con confirmación.
    - Soporte para modo oscuro mediante un composable.
    - Datos de ejemplo simulados; preparado para integración con backend.

    Props:
        Ninguna.

    Variables y estados:
        - isDark: indica si el modo oscuro está activo.
        - vacunas: lista reactiva de vacunas aplicadas.
        - loading: estado de carga de la tabla.
        - modal: controla la visibilidad del modal de edición.
        - mostrarDialogo: controla la visibilidad del diálogo de confirmación.
        - vacunaBorrar: almacena el registro seleccionado para eliminar.
        - form: modelo reactivo para el formulario de edición.
        - busqueda: texto de búsqueda ingresado por el usuario.
        - headers: configuración de columnas de la tabla.
        - datosFalsos: datos simulados para pruebas.

    Métodos principales:
        - obtenerVacunas: carga los datos de vacunas (simulado, preparado para backend).
        - abrirModal: abre el modal de edición con los datos seleccionados.
        - guardarCambios: guarda los cambios editados en el registro.
        - prepararEliminacion: prepara el registro para eliminar y muestra el 
        diálogo de confirmación.
        - confirmarEliminacion: elimina el registro seleccionado.
        - normalizar: normaliza texto para búsquedas insensibles a acentos y mayúsculas.
        - vacunasFiltradas: computed que filtra los registros según el texto de búsqueda.

    Componentes hijos:
        - ConfirmDialog: diálogo de confirmación reutilizable.

    Uso:
        Importar y utilizar dentro de una vista o layout principal para gestionar 
        vacunas aplicadas.

-->

<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
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
                :items="vacunasFiltradas"
                :loading="loading"
                loading-text="Cargando vacunas..."
                class="elevation-1"
                :items-per-page-text="'Ítems por páginas'"
                :style="{
                background: isDark ? '#23272f' : '#eee',
                borderRadius: '16px',
                padding: '16px',
                minWidth: '600px'  /* <-- Evita que se colapse en pantallas pequeñas */
                }"
            >
                <template #item.acciones="{ item }">
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
                </template>
            </v-data-table>
            </div>
        </v-col>
        </v-row>

        <!-- Modal de edición -->
        <v-dialog v-model="modal" max-width="90%">
        <v-card>
            <v-card-title>Editar Vacuna</v-card-title>
            <v-card-text>
            <v-form>
                <v-text-field label="Vacuna" v-model="form.vacuna" />
                <v-text-field label="Paciente" v-model="form.paciente" />
                <v-text-field label="Centro" v-model="form.centro" />
                <v-text-field label="Fecha" v-model="form.fecha" type="date" />
                <v-text-field label="Dosis" v-model="form.dosis" />
            </v-form>
            </v-card-text>
            <v-card-actions>
            <v-spacer />
            <v-btn text @click="modal = false">Cancelar</v-btn>
            <v-btn color="primary" @click="guardarCambios">Guardar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <!-- Modal de Confirmación -->
            <ConfirmDialog
            v-model="mostrarDialogo"
            title="Confirmar"
            :message="mensajeDialogo"
            @confirm="confirmarEliminacion"
            />
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useDarkMode } from '@/composables/useDarkMode'
import axios from '@/services/axios';
import { useSnackbar } from '@/composables/useSnackbar'

const $snackbar = useSnackbar()
const { isDark } = useDarkMode()
const vacunas = ref([])
const loading = ref(true)
const modal = ref(false)
const mostrarDialogo = ref(false)
const vacunaBorrar = ref({})
const form = ref({
    id: null,
    paciente: '',
    fecha: '',
    dosis: '',
    centro: ''
})
const busqueda = ref('')

const headers = [
    { title: 'Vacuna', value: 'vacuna' },
    { title: 'Paciente', value: 'paciente' },
    { title: 'Fecha', value: 'fecha' },
    { title: 'Dosis', value: 'dosis' },
    { title: 'Centro de Salud', value: 'centro' },
    { title: 'Acciones', value: 'acciones', sortable: false }
]


const obtenerVacunas = async () => {
    try {
        loading.value = true
        const response = await axios.get('/api/v1/applied-doses')
        vacunas.value = response.data
        .filter(v => v.isActive !== false)
        .map(v => ({
            id: v.id,
            vacuna: v.vaccineBatch?.vaccine?.vaccineName || 'Desconocida',
            paciente: `${v.patient?.firstName || ''} ${v.patient?.lastname || ''}`.trim(),
            centro: v.vaccinationCenter?.centerName || 'Desconocido',
            dosis: v.doseNumber,
            fecha: v.applicationDateTime ? v.applicationDateTime.split('T')[0] : 'N/A',
            raw: v
        }))
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al cargar las vacunas'
        $snackbar.error(`Algo salió mal al cargar las vacunas: ${msg}`)
    } finally {
        loading.value = false
    }
}

onMounted(() => obtenerVacunas())


const abrirModal = (item) => {
    form.value = { ...item }
    modal.value = true
}

const guardarCambios = async () => {
    try {
        loading.value = true
        if (form.value.raw?.id) {
        const data = {
            doseNumber: Number(form.value.dosis),
            applicationDateTime: form.value.fecha 
                ? `${form.value.fecha}T00:00:00.000Z`
                : form.value.raw.applicationDateTime,
            patientId: form.value.raw.patientId,
            vaccineBatchId: form.value.raw.vaccineBatchId,
            vaccinationCenterId: form.value.raw.vaccinationCenterId,
            applyingUserId: form.value.raw.applyingUserId
        }

            console.log('👉 Enviando al backend:', data)

            await axios.patch(`/api/v1/applied-doses/${form.value.raw.id}`, data)
            $snackbar.success('Vacuna actualizada correctamente')
        }
        modal.value = false
        obtenerVacunas()
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al guardar los cambios'
        $snackbar.error(`Algo salió mal: ${msg}`)
        console.error('❌ Detalle del error:', error.response || error)
    } finally {
        loading.value = false
    }
}


const prepararEliminacion = (item) => {
    vacunaBorrar.value = item
    mostrarDialogo.value = true
}

const confirmarEliminacion = async () => {
    try {
        loading.value = true
        await axios.put(`/api/v1/applied-doses/${vacunaBorrar.value.raw.id}`, { isActive: false })
        $snackbar.success('Vacuna eliminada correctamente')
        mostrarDialogo.value = false
        obtenerVacunas()
    } catch (error) {
        const msg = error.response?.data?.message || 'Error inesperado al eliminar la vacuna'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

const mensajeDialogo = computed(() => {
    return vacunaBorrar.value?.paciente
        ? `¿Deseas borrar la vacuna aplicada a ${vacunaBorrar.value.paciente}?`
        : '¿Deseas borrar esta vacuna?'
})

const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const vacunasFiltradas = computed(() => {
    const texto = normalizar(busqueda.value)
    return vacunas.value.filter(v => (
        normalizar(v.vacuna || '').includes(texto) ||
        normalizar(v.paciente || '').includes(texto) ||
        normalizar(v.centro || '').includes(texto) ||
        normalizar(v.fecha || '').includes(texto) ||
        normalizar(String(v.dosis || '')).includes(texto)
    ))
})
</script>
