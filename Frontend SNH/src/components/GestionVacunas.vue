<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <div class="mb-8">
            <h3 class="mb-4">Gestion de Vacunas:</h3>
            <p>En esta sección podrás gestionar a las Vacunas.</p>
            <p>Podrás ver, editar y eliminar a las Vacunas.</p>
            </div>
            <!-- Campo de búsqueda -->
            <v-text-field
            v-model="busqueda"
            label="Buscar por nombre o fabricante..."
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
                :items="vacunasFiltradas"
                :loading="loading"
                loading-text="Cargando Vacunas..."
                class="elevation-1"
                :style="{
                background: isDark ? '#23272f' : '#eee',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                minWidth: '600px'
                }"
            >
                <template #item.acciones="{ item }">
                <v-btn icon color="warning" @click="abrirModal(item)">
                    <v-icon class="text-white">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="error" @click="prepararEliminacion(item)">
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
            <v-card-title>Editar Vacuna</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="validarYGuardar">
                <!-- Nombre -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.name"
                        clearable
                        label="Nombre de la vacuna"
                        required
                        color="text"
                        :error-messages="errors.name"
                        prepend-icon="mdi-needle"
                    ></v-text-field>

                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- Fabricante -->
                    <v-select
                        class="mt-4"
                        v-model="form.manufacturer"
                        :items="fabricantes"
                        item-title="manufacturerName"
                        :item-value="'id'"
                        :loading="loadingFabricantes"
                        label="Fabricante"
                        color="text"
                        required
                        :error-messages="errors.manufacturer"
                        prepend-icon="mdi-factory">
                    </v-select>
        
                    <!-- Dosis requerida -->
                    <v-number-input 
                        class="mt-4"
                        v-model="form.requiredDoses"
                        clearable
                        label="Dosis requerida para la inmunización"
                        required
                        color="text"
                        :error-messages="errors.requiredDoses"
                        prepend-icon="mdi-check"
                        control-variant="hidden"
                    ></v-number-input>
        
                    <!-- Intervalo de dias entre dosis -->
                    <v-number-input 
                        class="mt-4"
                        v-model="form.intervalDoses"
                        clearable
                        label="Intervalo recomendado entre dosis en días"
                        required
                        color="text"
                        :error-messages="errors.intervalDoses"
                        prepend-icon="mdi-calendar-range"
                        control-variant="hidden"
                    ></v-number-input>
        
                    <!-- Temperatura -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.temperature"
                        clearable
                        label="Requisitos de temperatura de almacenamiento"
                        required
                        color="text"
                        :error-messages="errors.temperature"
                        prepend-icon="mdi-thermometer"
                    ></v-text-field>
                <v-card-actions>
                <v-spacer />
                <v-btn text @click="modal = false " :disabled="loading">Cancelar</v-btn>
                <v-btn color="primary" @click="validarYGuardar" :disabled="loading">Guardar</v-btn>
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

const vacunas = ref([])
const fabricantes = ref([])
const loading = ref(false)
const loadingFabricantes = ref(false)
const modal = ref(false)
const mostrarDialogo = ref(false)
const vacunaBorrar = ref({})
const busqueda = ref('')
const form = ref({
    id: null,
    name: '',
    requiredDoses: '',
    intervalDoses: '',
    temperature: '',
    manufacturer: '',
})
const errors = ref({})

const schema = yup.object({
        name: yup.string().required('El nombre es requerido').min(1, "Debe contener minimo 1 letras").matches(/^[a-zA-Z0-9 +\-°]+$/,"Solo pueden ser letras, numeros y signos (+ - °) sin tildes"),
        manufacturer: yup.string().required('El fabricante es requerido'),
        requiredDoses: yup.number().required('Las dosis requeridas son obligatorias').min(1, "Debe ser al menos 1 dosis"),
        intervalDoses: yup.number().required('El intervalo de dias para la dosis es obligatorio').min(1,"Debe ser al menos 1 día"),
        temperature: yup.string().required('Los requisitos son obligatorios').min(5,'Debe contener minimo 5 letras').matches(/^[a-zA-Z0-9 +\-°]+$/,"Solo pueden ser letras, numeros y signos (+ - °) sin tildes")
})

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

const headers = [
    { title: 'Nombre', value: 'nombre', align: 'center' },
    { title: 'Dosis Requerida', value: 'dosisRequerida', align: 'center' },
    { title: 'Intervalo recomendado entre dosis en días', value: 'intervaloDias', align: 'center' },
    { title: 'Temperatura de Almacenamiento', value: 'temperatura', align: 'center' },
    { title: 'Fabricante', value: 'manufacturer', align: 'center' },
    { title: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
]

const obtenerVacunas = async () => {
    try {
        loading.value = true
        const res = await axios.get('/api/v1/vaccines')
        vacunas.value = res.data
        .filter(p => p.isActive !== false)
        .map(p => ({
            id: p.id,
            nombre: p.vaccineName,
            dosisRequerida: p.requiredDoses || 'N/A',
            intervaloDias: p.doseIntervalDays || 'N/A',
            temperatura: p.storageTemperature || 'N/A',
            manufacturer: p.manufacturer.manufacturerName || 'N/A',
            raw: p
        }))
    } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar las Vacunas'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    obtenerVacunas()
    cargarFabricantes()
})

const cargarFabricantes = async () => {
    try {
        loadingFabricantes.value = true
        const res = await axios.get('/api/v1/manufacturers')
        fabricantes.value = res.data.map(vb => ({
        id: vb.id,
        manufacturerName: vb.manufacturerName
        }))
    } catch (error) {
        const msg = error.response?.data?.message || 'Error al cargar los fabricantes'
        $snackbar.error(`Algo salió mal al cargar los fabricantes: ${msg}`)
    } finally{
        loadingFabricantes.value = false
    }
}

const abrirModal = (item) => {
    const raw = item.raw
    form.value = {
        id: raw.id,
        name: raw.vaccineName,
        requiredDoses: raw.requiredDoses,
        intervalDoses: raw.doseIntervalDays,
        temperature: raw.storageTemperature,
        manufacturer: raw.manufacturer.id
    }
    modal.value = true
}

const guardarCambios = async () => {
    try {
        loading.value = true
        const data = {
            vaccineName: form.value.name,
            requiredDoses: Number(form.value.requiredDoses),
            doseIntervalDays: Number(form.value.intervalDoses),
            storageTemperature: form.value.temperature,
            manufacturerId: form.value.manufacturer
        }
        await axios.patch(`/api/v1/vaccines/${form.value.id}`, data)
        $snackbar.success('Vacuna actualizada correctamente')
        modal.value = false
        obtenerVacunas()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al guardar'
        $snackbar.error(`Algo salió mal: ${msg}`)
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
        await axios.patch(`/api/v1/vaccines/${vacunaBorrar.value.id}`, { isActive: false })
        $snackbar.success('Vacuna eliminada correctamente')
        mostrarDialogo.value = false
        obtenerVacunas()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al eliminar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

const mensajeDialogo = computed(() => {
    return vacunaBorrar.value?.vaccineName
    ? `¿Deseas eliminar la vacuna ${vacunaBorrar.value.vaccineName}?`
    : '¿Deseas eliminar esta vacuna?'
})

const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const vacunasFiltradas = computed(() => {
    const texto = normalizar(busqueda.value)
    return vacunas.value.filter(p =>
        normalizar(p.nombre).includes(texto) ||
        normalizar(p.dosisRequerida.toString()).includes(texto) ||
        normalizar(p.intervaloDias.toString()).includes(texto) ||
        normalizar(p.temperatura).includes(texto) ||
        normalizar(p.manufacturer).includes(texto)
    )
    })
</script>
