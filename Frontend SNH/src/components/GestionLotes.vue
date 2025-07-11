<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <div class="mb-8">
            <h3 class="mb-4">Gestion de Lotes:</h3>
            <p>En esta sección podrás gestionar los Lotes.</p>
            <p>Podrás ver, editar y eliminar los Lotes</p>
            </div>
            <!-- Campo de búsqueda -->
            <v-text-field
            v-model="busqueda"
            label="Buscar por nombre o pais"
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
                :items="lotesFiltrados"
                :loading="loading"
                loading-text="Cargando Lotes..."
                :items-per-page-text="'Ítems por páginas'"
                class="elevation-1"
                :style="{
                background: isDark ? '#23272f' : '#eee',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                minWidth: '600px'
                }"
            >
            <!--Formateo para las fechas ISO -> DD-MM-YYYY  -->
            <template #item.manufactureDate="{ item }">
                {{ formatearFecha(item.manufactureDate) }}
            </template>

            <template #item.expirationDate="{ item }">
                {{ formatearFecha(item.expirationDate) }}
            </template>

            <!-- Botones Tabla -->
                <template #item.acciones="{ item }">
                <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                    <v-btn icon color="warning" class="mb-1 mt-1" @click="abrirModal(item)">
                        <v-icon class="text-white">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="error" class="mb-1 mt-1" @click="prepararEliminacion(item)">
                        <v-icon class="text-white">mdi-delete</v-icon>
                    </v-btn>
                </div>
                </template>
            </v-data-table>
            </div>
        </v-col>
        </v-row>

        <!-- Modal de edición -->
        <v-dialog v-model="modal" max-width="600px">
        <v-card>
            <v-card-title>Editar Lotes</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="validarYGuardar">
                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- Vacuna -->
                    <v-select
                        class="mt-4"
                        v-model="form.vaccine"
                        :items="vacunas"
                        item-title="vaccineName"
                        :item-value="'id'"
                        :loading="loadingVacunas"
                        :disabled="loadingVacunas"
                        label="Vacuna"
                        color="text"
                        required
                        :error-messages="errors.vaccine"
                        prepend-icon="mdi-needle">
                    </v-select>
        
                    <!-- Numero del lote -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.batchNumber"
                        clearable
                        label="Numero del Lote"
                        required
                        color="text"
                        :error-messages="errors.batchNumber"
                        prepend-icon="mdi-package"
                    ></v-text-field>
        
                    <!--  Fecha de fabricación del lote -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.manufactureDate"
                        clearable
                        label="Fecha de fabricación del lote"
                        type="date"
                        color="text"
                        required
                        :error-messages="errors.manufactureDate"
                        prepend-icon="mdi-calendar">
                    </v-text-field>
        
                    <!--  Fecha de vencimiento del lote  -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.expirationDate"
                        clearable
                        label="Fecha de vencimiento del lote"
                        type="date"
                        color="text"
                        required
                        :error-messages="errors.expirationDate"
                        prepend-icon="mdi-calendar">
                    </v-text-field>
        
                    <!-- Cantidad de viales en este lote inicialmente -->
                    <v-number-input 
                        class="mt-4"
                        v-model="form.initialQuantity"
                        clearable
                        label="Cantidad de viales en este lote inicialmente"
                        required
                        color="text"
                        :error-messages="errors.initialQuantity"
                        prepend-icon="mdi-asterisk"
                        control-variant="hidden"
                    ></v-number-input>
        
                    <!-- Cantidad de viales aún disponibles en este lote -->
                    <v-number-input 
                        class="mt-4"
                        v-model="form.availableQuantity"
                        clearable
                        label="Cantidad de viales aún disponibles en este lote"
                        required
                        color="text"
                        :error-messages="errors.availableQuantity"
                        prepend-icon="mdi-asterisk"
                        control-variant="hidden"
                    ></v-number-input>
                <!-- Botones Modal -->
                <v-card-actions>
                <v-spacer />
                <v-btn text @click="modal = false " :disabled="loading">Cancelar</v-btn>
                <v-btn color="text" @click="validarYGuardar" :disabled="loading">Guardar</v-btn>
                <v-btn 
                    color="text" 
                    @click="estadoLote" 
                    :disabled="loading"
                    >
                    <v-icon start>
                        {{ loteAbierto ? 'mdi-lock-open-outline' : 'mdi-lock-outline' }}
                    </v-icon>
                    {{ loteAbierto ? 'Cerrar Lote' : 'Abrir Lote' }}
                </v-btn>
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

const lotes = ref([])
const vacunas = ref([])
const loading = ref(false)
const loadingVacunas = ref(false)
const modal = ref(false)
const mostrarDialogo = ref(false)
const loteBorrar = ref({})
const loteAbierto = ref(false)
const busqueda = ref('')
const form = ref({
    id: null,
    vaccine: '',
    batchNumber: '',
    manufactureDate: '',
    expirationDate: '',
    initialQuantity: '',
    availableQuantity: '',
    status: 1
})

const errors = ref({})

const schema = yup.object({
    batchNumber: yup.string().required('El número del lote es obligatorio').min(1, "Debe ser al menos 1").matches(/^[a-zA-Z0-9 _-]+$/, 'Solo pueden ser letras, números y signos ( - _ )'),
    manufactureDate: yup.date().typeError('Debe ser una fecha valida').required('La fecha de fabricación es obligatoria').max(new Date(), 'La fecha de fabricación no puede ser futura'),
    expirationDate: yup.date().typeError('Debe ser una fecha valida').required('La fecha de vencimiento es obligatoria').min(new Date(), 'La fecha de vencimiento no puede ser pasada'),
    initialQuantity: yup.number().required('La cantidad inicial es obligatoria').min(1,"Debe ser al menos 1"),
    availableQuantity: yup.number().required('La cantidad disponible es obligatoria').min(1,"Debe ser al menos 1"),
    vaccine: yup.string().required('La vacuna es requerida')
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
    { title: 'Vacuna', value: 'vaccineName', align: 'center' },
    { title: 'Numero del lote', value: 'batchNumber', align: 'center' },
    { title: 'Fecha de Fabricación', value: 'manufactureDate', align: 'center' },
    { title: 'Fecha de Vencimiento', value: 'expirationDate', align: 'center' },
    { title: 'Cantidad de viales inicial', value: 'initialQuantity', align: 'center' },
    { title: 'Cantidad de viales disponible', value: 'availableQuantity', align: 'center' },
    { title: 'Estado', value: 'status', align: 'center' },
    { title: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
]

// Cargar a la tabla todos los lotes
const obtenerLotes = async () => {
    try {
        loading.value = true
        const res = await axios.get('/api/v1/vaccine-batches')
        lotes.value = res.data
        .filter(p => p.isActive !== false)
        .map(p => ({
            id: p.id,
            vaccineName: p.vaccine.vaccineName || 'N/A',
            batchNumber: p.batchNumber,
            manufactureDate: p.manufactureDate,
            expirationDate: p.expirationDate,
            initialQuantity: p.initialQuantity,
            availableQuantity: p.availableQuantity,
            status: p.status === 1 ? 'Abierto' : 'Cerrado',
            raw: p
        }))
    } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar los Lotes'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Al cargar el componente se cargan los lotes
onMounted(() => {
    obtenerLotes()
})

// Formatear la fecha
const formatearFecha = (fecha) => {
    if (!fecha) return ''
    const d = new Date(fecha)
    const dia = String(d.getDate()).padStart(2, '0')
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const anio = d.getFullYear()
    return `${dia}-${mes}-${anio}`
}

// Cargar Vacunas
const cargarVacunas = async () => {
    try {
        loadingVacunas.value = true
        const res = await axios.get('/api/v1/vaccines')
        vacunas.value = res.data.map(vb => ({
        id: vb.id,
        vaccineName: vb.vaccineName
        }))
    } catch (error) {
        const msg = error.response?.data?.message || 'Error al cargar las Vacunas'
        $snackbar.error(`Algo salió mal al cargar las Vacunas: ${msg}`)
    } finally{
        loadingVacunas.value = false;
    }
}

// Modal para la edicion
const abrirModal = (item) => {
    const raw = item.raw
    form.value = {
    id: raw.id,
    vaccine: raw.vaccine.id,
    batchNumber: raw.batchNumber,
    manufactureDate: raw.manufactureDate,
    expirationDate: raw.expirationDate,
    initialQuantity: raw.initialQuantity,
    availableQuantity: raw.availableQuantity,
    status: raw.status || 1
    }
    loteAbierto.value = form.value.status === 1
    modal.value = true
    // Carga las vacunas al abrir el modal
    cargarVacunas()
}

// Guardar cambios
const guardarCambios = async () => {
    try {
        loading.value = true
        const data = {
        vaccineId: form.value.vaccine,
        batchNumber: form.value.batchNumber,
        manufactureDate: form.value.manufactureDate,
        expirationDate: form.value.expirationDate,
        initialQuantity: form.value.initialQuantity,
        availableQuantity: form.value.availableQuantity,
        }
        await axios.patch(`/api/v1/vaccine-batches/${form.value.id}`, data)
        $snackbar.success('Fabricante actualizado correctamente')
        modal.value = false
        obtenerLotes()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al guardar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Prepara el borrado, carga la informacion del lote y pregunta si lo quieres borrar
const prepararEliminacion = (item) => {
    loteBorrar.value = item
    mostrarDialogo.value = true
}

// Luego de la consulta, se confirma la eliminacion
const confirmarEliminacion = async () => {
    try {
        loading.value = true
        await axios.delete(`/api/v1/vaccine-batches/${loteBorrar.value.id}`)
        $snackbar.success('Lote eliminado correctamente')
        mostrarDialogo.value = false
        obtenerLotes()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al eliminar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Mensaje del dialogo donde pregunta si quieres borrar el lote
const mensajeDialogo = computed(() => {
    return loteBorrar.value?.batchNumber
    ? `¿Deseas eliminar el Lote ${loteBorrar.value.batchNumber}?`
    : '¿Deseas eliminar este Lote?'
})

const estadoLote = async () => {
    try {
        loading.value = true
        const nuevoEstado = form.value.status === 1 ? 2 : 1

        await axios.patch(`/api/v1/vaccine-batches/${form.value.id}/status/${nuevoEstado}`)

        form.value.status = nuevoEstado
        loteAbierto.value = nuevoEstado === 1
        $snackbar.success('Estado del lote actualizado correctamente')
        obtenerLotes()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error al cambiar el estado del lote'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Normalizar texto para la tabla
const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const lotesFiltrados = computed(() => {
    const texto = normalizar(busqueda.value)
    return lotes.value.filter(p =>
        normalizar(p.vaccineName).includes(texto) ||
        normalizar(p.batchNumber).includes(texto) ||
        normalizar(p.manufactureDate).includes(texto) ||
        normalizar(p.expirationDate).includes(texto) ||
        normalizar(p.initialQuantity).includes(texto) ||
        normalizar(p.availableQuantity).includes(texto) ||
        normalizar(p.status).includes(texto) 
    )
    })
</script>
