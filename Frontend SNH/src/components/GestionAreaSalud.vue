<template>
    <v-container fluid>
        <v-row>
        <v-col cols="12">
            <div class="mb-8">
            <h3 class="mb-4">Gestion de los Centros de Salud:</h3>
            <p>En esta sección podrás gestionar los Centros de Salud.</p>
            <p>Podrás ver, editar y eliminar los Centros de Salud</p>
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
                loading-text="Cargando Centros de Salud..."
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
            <!-- Botones Tabla -->
                <template #item.acciones="{ item }" >
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
            <v-card-title>Editar Centro de Salud</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="validarYGuardar">
                
                    <!-- Nombre  -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.centerName"
                        clearable
                        label="Nombre del Centro de Salud"
                        required
                        color="text"
                        :error-messages="errors.centerName"
                        prepend-icon="mdi-hospital-building"
                    ></v-text-field>
        
                    <!-- Dirección -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.address"
                        clearable
                        label="Dirección del Centro de Salud"
                        required
                        color="text"
                        :error-messages="errors.address"
                        prepend-icon="mdi-directions"
                    ></v-text-field>
        
                    <!-- Teléfono -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.phone"
                        clearable
                        label="Teléfono del Centro de Salud"
                        required
                        color="text"
                        :error-messages="errors.phone"
                        prepend-icon="mdi-phone"
                    ></v-text-field>
        
                    <!-- Teléfono Móvil -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.mobilePhone"
                        clearable
                        label="Teléfono Móvil del Centro de Salud"
                        required
                        color="text"
                        :error-messages="errors.mobilePhone"
                        prepend-icon="mdi-phone"
                    ></v-text-field>
        
                    <!-- Email -->
                    <v-text-field
                        class="mt-4"
                        v-model="form.email"
                        clearable
                        label="Email del Centro de Salud"
                        required
                        color="text"
                        :error-messages="errors.email"
                        prepend-icon="mdi-email"
                    ></v-text-field>

                <!--Botones modal  -->
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

const areasSalud = ref([])
const loading = ref(false)
const modal = ref(false)
const mostrarDialogo = ref(false)
const areaSaludBorrar = ref({})
const busqueda = ref('')
const form = ref({
    id: null,
    centerName: '',
    address: '',
    email: '',
    phone: '',
    mobilePhone: ''
})
const errors = ref({})

const schema = yup.object({
        centerName: yup.string().required('El nombre del centro de salud es requerido').min(3,"Debe contener mínimo 3 caracteres").matches(/^[a-zA-Z0-9 _-]+$/,"Solo pueden ser letras, numeros y signos ( - _ )"),
        address: yup.string().required('La dirección del centro de salud es requerida').min(1,"Debe contener mínimo 1 caracter").matches(/^[a-zA-Z0-9 _-]+$/,"Solo pueden ser letras, numeros y signos ( - _ )"),
        phone: yup.string().required('El teléfono del centro de salud es requerido').min(11,"Debe contener minimo 11 números").matches(/^[0-9]+$/,"Solo pueden ser números"),
        mobilePhone: yup.string().required('El teléfono del centro de salud es requerido').min(11,"Debe contener minimo 11 números").matches(/^[0-9]+$/,"Solo pueden ser números"),
        email: yup.string().matches(/^[\w-.]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$/, 'Solo se permiten correos de Gmail, Outlook, Yahoo o Hotmail').required('El correo electrónico es requerido'),
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
    { title: 'Nombre', value: 'centerName', align: 'center' },
    { title: 'Dirección', value: 'address', align: 'center' },
    { title: 'Email', value: 'email', align: 'center' },
    { title: 'Teléfono', value: 'phone', align: 'center' },
    { title: 'Teléfono movil', value: 'mobilePhone', align: 'center' },
    { title: 'Acciones', value: 'acciones', sortable: false, align: 'center' }
]

// Cargar a la tabla todos las areas de salud
const obtenerAreas = async () => {
    try {
        loading.value = true
        const res = await axios.get('/api/v1/vaccination-centers')
        areasSalud.value = res.data
        .filter(p => p.isActive !== false)
        .map(p => ({
            id: p.id,
            centerName: p.centerName || 'N/A',
            address: p.address || 'N/A',
            email: p.email || 'N/A',
            phone: p.phone || 'N/A',
            mobilePhone: p.mobilePhone || 'N/A',
            raw: p
        }))
    } catch (err) {
        const msg = err.response?.data?.message || 'Error al cargar los Centros de Salud'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}
// Al cargar el componente se cargan las areas de salud
onMounted(() => {
    obtenerAreas()
})

// Modal para la edicion
const abrirModal = (item) => {
    const raw = item.raw
    form.value = {
        id: raw.id,
        centerName: raw.centerName,
        address: raw.address,
        email: raw.email,
        phone: raw.phone,
        mobilePhone: raw.mobilePhone,
    }
    modal.value = true
}

// Guardar cambios
const guardarCambios = async () => {
    try {
        loading.value = true
        const data = {
        centerName: form.value.centerName,
        address: form.value.address,
        email: form.value.email,
        phone: form.value.phone,
        mobilePhone: form.value.mobilePhone,
        }
        await axios.patch(`/api/v1/vaccination-centers/${form.value.id}`, data)
        $snackbar.success('Centro de Salud actualizado correctamente')
        modal.value = false
        obtenerAreas()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al guardar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Prepara el borrado, carga la informacion del area de salud y pregunta si la quieres borrar
const prepararEliminacion = (item) => {
    areaSaludBorrar.value = item
    mostrarDialogo.value = true
}

// Luego de la consulta, se confirma la eliminacion
const confirmarEliminacion = async () => {
    try {
        loading.value = true
        await axios.delete(`/api/v1/vaccination-centers/${areaSaludBorrar.value.id}`)
        $snackbar.success('Centro de Salud eliminado correctamente')
        mostrarDialogo.value = false
        obtenerAreas()
    } catch (err) {
        const msg = err.response?.data?.message || 'Error inesperado al eliminar'
        $snackbar.error(`Algo salió mal: ${msg}`)
    } finally {
        loading.value = false
    }
}

// Mensaje del dialogo donde pregunta si quieres borrar el area de salud
const mensajeDialogo = computed(() => {
    return areaSaludBorrar.value?.centerName
    ? `¿Deseas eliminar el Centro de Salud ${areaSaludBorrar.value.centerName}?`
    : '¿Deseas eliminar este Centro de Salud?'
})

// Normalizar texto para la tabla
const normalizar = (str) => str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const areasFiltradas = computed(() => {
    const texto = normalizar(busqueda.value)
    return areasSalud.value.filter(p =>
        normalizar(p.centerName).includes(texto) ||
        normalizar(p.address).includes(texto) ||
        normalizar(p.email).includes(texto) ||
        normalizar(p.phone).includes(texto) ||
        normalizar(p.mobilePhone).includes(texto)
    )
    })
</script>
