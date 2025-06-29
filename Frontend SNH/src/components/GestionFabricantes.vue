<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <div class="mb-8">
            <h3 class="mb-4">Gestion de los Fabricantes:</h3>
            <p>En esta sección podrás gestionar los Fabricantes.</p>
            <p>Podrás ver, editar y eliminar los Fabricantes</p>
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
                :items="fabricantesFiltrados"
                :loading="loading"
                loading-text="Cargando Fabricantes..."
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
            <v-card-title>Editar Fabricantes</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="validarYGuardar">

                    <!-- Fabricante -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.manufacturer"
                        clearable
                        label="Fabricante"
                        required
                        color="text"
                        :error-messages="errors.manufacturer"
                        prepend-icon="mdi-factory"
                    ></v-text-field>
        
                    <!-- Buscado por nombre, agregado como array, devolver ID  -->
                    <!-- País -->
                    <v-select
                        class="mt-4"
                        v-model="form.country"
                        :items="paises"
                        item-title="nameCountry"
                        :item-value="'id'"
                        :loading="loadingPaises"
                        :disabled="loadingPaises"
                        label="País"
                        color="text"
                        required
                        :error-messages="errors.country"
                        prepend-icon="mdi-earth">
                    </v-select>

                <!-- Botones modal -->
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

const fabricantes = ref([])
const paises = ref([])
const loadingPaises = ref(false)
const loading = ref(false)
const modal = ref(false)
const mostrarDialogo = ref(false)
const fabricanteBorrar = ref({})
const busqueda = ref('')
const form = ref({
    id: null,
    manufacturer: '',
    country: ''
})
const errors = ref({})

const schema = yup.object({
        manufacturer: yup.string().required('El fabricante es requerido').min(1,"Debe contener mínimo 1 caracter").matches(/^[a-zA-Z\s]+$/,"Solo pueden ser letras sin tildes"),
        country: yup.string().required('El país es requerido').min(1,"Debe contener mínimo 1 caracter"),
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
    { title: 'Nombre', value: 'manufacturer', align: 'center' },
    { title: 'País', value: 'country', align: 'center' },
    { title: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
]

// Cargar a la tabla todos los fabricantes
const obtenerFabricantes = async () => {
    try {
        loading.value = true
        const res = await axios.get('/api/v1/manufacturers')
        fabricantes.value = res.data
        .filter(p => p.isActive !== false)
        .map(p => ({
            id: p.id,
            manufacturer: p.manufacturerName || 'N/A',
            country: p.country.nameCountry || 'N/A',
            raw: p
        }))
    } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar los Fabricantes'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Al cargar el componente se cargan los fabricantes
onMounted(() => {
    obtenerFabricantes()
})

// Cargar paises
const cargarPaises = async () => {
    try {
        loadingPaises.value = true
        const res = await axios.get('/api/v1/countries')
        paises.value = res.data.map(vb => ({
        id: vb.id,
        nameCountry: vb.nameCountry
        }))
    } catch (error) {
        const msg = error.response?.data?.message || 'Error al cargar los paises'
        $snackbar.error(`Algo salió mal al cargar los paises: ${msg}`)
    } finally{
        loadingPaises.value = false
    }
}

// Modal para la edicion
const abrirModal = (item) => {
    const raw = item.raw
    form.value = {
        id: raw.id,
        manufacturer: raw.manufacturerName,
        country: raw.country.id
    }
    modal.value = true
    // Carga los paises al abrir el modal
    cargarPaises()
}

// Guardar cambios
const guardarCambios = async () => {
    try {
        loading.value = true
        const data = {
        manufacturerName: form.value.nombre,
        country: form.value.pais
        }
        await axios.patch(`/api/v1/manufacturers/${form.value.id}`, data)
        $snackbar.success('Fabricante actualizado correctamente')
        modal.value = false
        obtenerFabricantes()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al guardar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Prepara el borrado, carga la informacion del fabricante y pregunta si lo quieres borrar
const prepararEliminacion = (item) => {
    fabricanteBorrar.value = item
    mostrarDialogo.value = true
}

// Luego de la consulta, se confirma la eliminacion
const confirmarEliminacion = async () => {
    try {
        loading.value = true
        await axios.patch(`/api/v1/manufacturers/${fabricanteBorrar.value.id}`, { isActive: false })
        $snackbar.success('Fabricante eliminado correctamente')
        mostrarDialogo.value = false
        obtenerFabricantes()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al eliminar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Mensaje del dialogo donde pregunta si quieres borrar el fabricante
const mensajeDialogo = computed(() => {
    return fabricanteBorrar.value?.manufacturerName
    ? `¿Deseas eliminar el Fabricante ${fabricanteBorrar.value.manufacturerName}?`
    : '¿Deseas eliminar este Fabricante?'
})

// Normalizar texto para la tabla
const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const fabricantesFiltrados = computed(() => {
    const texto = normalizar(busqueda.value)
    return fabricantes.value.filter(p =>
        normalizar(p.manufacturer).includes(texto) ||
        normalizar(p.country).includes(texto)
    )
    })
</script>
