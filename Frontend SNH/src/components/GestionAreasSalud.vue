<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <div class="mb-8">
            <h3 class="mb-4">Gestion de las Areas de Salud:</h3>
            <p>En esta sección podrás gestionar las Areas de Salud.</p>
            <p>Podrás ver, editar y eliminar las Areas de Salud</p>
            </div>
            <!-- Campo de búsqueda -->
            <v-text-field
            v-model="busqueda"
            label="Buscar por nombre o direccion"
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
                :items="areasFiltradas"
                :loading="loading"
                loading-text="Cargando Areas de Salud..."
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
            <v-card-title>Editar Area de Salud</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="validarYGuardar">
                <v-text-field
                v-model="form.nombre"
                label="Nombre"
                :error-messages="errors.nombre"
                required
                clearable
                />
                <v-text-field
                v-model="form.direccion"
                label="Dirección"
                :error-messages="errors.direccion"
                required
                clearable
                />
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

const areasSalud = ref([])
const loading = ref(false)
const modal = ref(false)
const mostrarDialogo = ref(false)
const areaSaludBorrar = ref({})
const busqueda = ref('')
const form = ref({
    id: null,
    nombre: '',
    direccion: ''
})
const errors = ref({})

const schema = yup.object({
    nombre: yup.string().required('El nombre es requerido').min(2, 'Mínimo 2 letras').matches(/^[a-zA-ZñÑ ]+$/, 'Solo letras y espacios'),
    direccion: yup.string().min(1, 'Mínimo 1 caracter').matches(/^[a-zA-Z0-9 _-]+$/, 'Solo pueden ser letras, números y signos ( - _ )'),

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
    { title: 'Dirección', value: 'direccion', align: 'center' },
    { title: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
]

const obtenerAreas = async () => {
    try {
        loading.value = true
        const res = await axios.get('/api/v1/vaccination-centers')
        areasSalud.value = res.data
        .filter(p => p.isActive !== false)
        .map(p => ({
            id: p.id,
            nombre: p.centerName || 'N/A',
            direccion: p.address || 'N/A',
            raw: p
        }))
    } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar las Areas de Salud'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    obtenerAreas()
})


const abrirModal = (item) => {
    const raw = item.raw
    form.value = {
        id: raw.id,
        nombre: raw.centerName,
        direccion: raw.address
    }
    modal.value = true
}

const guardarCambios = async () => {
    try {
        loading.value = true
        const data = {
        centerName: form.value.nombre,
        address: form.value.direccion
        }
        await axios.patch(`/api/v1/vaccination-centers/${form.value.id}`, data)
        $snackbar.success('Area de Salud actualizada correctamente')
        modal.value = false
        obtenerAreas()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al guardar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

const prepararEliminacion = (item) => {
    areaSaludBorrar.value = item
    mostrarDialogo.value = true
}

const confirmarEliminacion = async () => {
    try {
        loading.value = true
        await axios.patch(`/api/v1/vaccination-centers/${areaSaludBorrar.value.id}`, { isActive: false })
        $snackbar.success('Area de Salud eliminada correctamente')
        mostrarDialogo.value = false
        obtenerAreas()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al eliminar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

const mensajeDialogo = computed(() => {
    return areaSaludBorrar.value?.centerName
    ? `¿Deseas eliminar el Area de Salud ${areaSaludBorrar.value.centerName}?`
    : '¿Deseas eliminar este Area de Salud?'
})

const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const areasFiltradas = computed(() => {
    const texto = normalizar(busqueda.value)
    return areasSalud.value.filter(p =>
        normalizar(p.nombre).includes(texto) ||
        normalizar(p.direccion).includes(texto)
    )
    })
</script>
