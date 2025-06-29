<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <div class="mb-8">
            <h3 class="mb-4">Gestion de los Paises:</h3>
            <p>En esta sección podrás gestionar los Paises.</p>
            <p>Podrás ver, editar y eliminar los Paises</p>
            </div>
            <!-- Campo de búsqueda -->
            <v-text-field
            v-model="busqueda"
            label="Buscar por nombre"
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
                :items="paisesFiltrados"
                :loading="loading"
                loading-text="Cargando Paises..."
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
            <v-card-title>Editar País</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="validarYGuardar">

                    <!-- Pais -->
                <v-text-field
                    class="mt-4"
                    v-model="form.country"
                    clearable
                    label="País"
                    required
                    color="text"
                    :error-messages="errors.country"
                    prepend-icon="mdi-earth"
                ></v-text-field>

                <!-- Botones Modal -->
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

const paises = ref([])
const loading = ref(false)
const modal = ref(false)
const mostrarDialogo = ref(false)
const paisBorrar = ref({})
const busqueda = ref('')
const form = ref({
    id: null,
    country: ''
})
const errors = ref({})

const schema = yup.object({
    country: yup.string().required('El país es requerido').min(3,"Debe contener minimo 3 letras").matches(/^[a-zA-ZñÑ ]+$/,"Solo pueden ser letras sin caracteres espciales ni numeros"),
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
    { title: 'País', value: 'pais', align: 'center' },
    { title: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
]

// Cargar a la tabla todos los paises
const obtenerPaises = async () => {
    try {
        loading.value = true
        const res = await axios.get('/api/v1/countries')
        paises.value = res.data
        .filter(p => p.isActive !== false)
        .map(p => ({
            id: p.id,
            pais: p.nameCountry || 'N/A',
            raw: p
        }))
    } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar los Paises'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Al cargar el componente se cargan los paises
onMounted(() => {
    obtenerPaises()
})

// Modal para la edicion
const abrirModal = (item) => {
    const raw = item.raw
    form.value = {
        id: raw.id,
        country: raw.nameCountry,
    }
    modal.value = true
}

// Guardar cambios
const guardarCambios = async () => {
    try {
        loading.value = true
        const data = {
        nameCountry: form.value.country,
        }
        await axios.patch(`/api/v1/countries/${form.value.id}`, data)
        $snackbar.success('País actualizado correctamente')
        modal.value = false
        obtenerPaises()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al guardar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Prepara el borrado, carga la informacion del pais y pregunta si lo quieres borrar
const prepararEliminacion = (item) => {
    paisBorrar.value = item
    mostrarDialogo.value = true
}

// Luego de la consulta, se confirma la eliminacion
const confirmarEliminacion = async () => {
    try {
        loading.value = true
        await axios.delete(`/api/v1/countries/${paisBorrar.value.id}`)
        $snackbar.success('País eliminado correctamente')
        mostrarDialogo.value = false
        obtenerPaises()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al eliminar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Mensaje del dialogo donde pregunta si quieres borrar el pais
const mensajeDialogo = computed(() => {
    return paisBorrar.value?.pais
    ? `¿Deseas eliminar el País ${paisBorrar.value.pais}?`
    : '¿Deseas eliminar este País?'
})

// Normalizar texto para la tabla
const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const paisesFiltrados = computed(() => {
    const texto = normalizar(busqueda.value)
    return paises.value.filter(p =>
        normalizar(p.pais).includes(texto)
    )
    })
</script>
