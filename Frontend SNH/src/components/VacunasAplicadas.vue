<!-- 
VacunasAplicadas.vue

Componente Vue para la gestión y visualización de vacunas aplicadas a pacientes.

Características principales:
- Búsqueda dinámica por vacuna, paciente, centro, fecha o dosis.
- Tabla de datos con listado de vacunas aplicadas, usando Vuetify.
- Acciones de edición y eliminación de registros.
- Modal para editar los datos de una vacuna aplicada.
- Soporte para modo oscuro mediante un composable.
- Datos simulados para pruebas, con posibilidad de integración a backend (comentado).
- Filtros de búsqueda insensibles a mayúsculas/minúsculas y acentos.

Props: Ninguna.

Variables reactivas:
- vacunas: Lista de vacunas aplicadas.
- loading: Estado de carga de la tabla.
- modal: Controla la visibilidad del modal de edición.
- form: Datos del formulario de edición.
- busqueda: Texto de búsqueda ingresado por el usuario.

Métodos principales:
- obtenerVacunas: Carga los datos de vacunas (simulados o desde backend).
- abrirModal: Abre el modal de edición con los datos seleccionados.
- guardarCambios: Guarda los cambios realizados en el modal.
- borrarVacuna: Elimina una vacuna de la lista (con confirmación).
- normalizar: Normaliza texto para búsqueda insensible a acentos y mayúsculas.
- vacunasFiltradas: Computed que retorna la lista filtrada según la búsqueda.

Dependencias:
- Vue 3 (Composition API)
- Vuetify
- Composable useDarkMode (para modo oscuro)
--> 
<template>
    <div>
        <v-text-field
            v-model="busqueda"
            label="Buscar vacuna, paciente, centro, fecha, etc."
            prepend-inner-icon="mdi-magnify"
            clearable
            :color="isDark ? 'text' : 'text'"
            :theme="isDark ? 'SNHdark' : 'SNH'"
            class="mb-4"
        />

        <v-data-table
        :headers="headers"
        :items="vacunasFiltradas"
        :loading="loading"
        loading-text="Cargando vacunas..."
        class="elevation-1"
        :items-per-page-text="'Ítems por páginas'"
        :style="{ background: isDark ? '#23272f' : '#eee', borderRadius: '16px', padding: '32px' }"
        >

        <template #item.acciones="{ item }">
            <v-btn icon color="warning" class="mb-1 mt-1" @click="abrirModal(item)">
            <v-icon class="text-white">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" class="mb-1 mt-1" @click="borrarVacuna(item.id)">
            <v-icon class="text-white">mdi-delete</v-icon>
            </v-btn>
        </template>
        </v-data-table>

        <!-- MODAL DE EDICIÓN -->
        <v-dialog v-model="modal" max-width="500">
        <v-card>
            <v-card-title>Editar Vacuna</v-card-title>
            <v-card-text>
            <v-form>
                <v-text-field label="Nombre" v-model="form.nombre" />
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { useDarkMode } from '@/composables/useDarkMode'
// import axios from 'axios'

const { isDark } = useDarkMode()
const vacunas = ref([])
const loading = ref(true)
const modal = ref(false)

const form = ref({ id: null, vacuna: '', paciente:'', fecha: '', dosis: '', centro:'', })

const busqueda = ref('');

const datosFalsos = [
    {
        "id": 1,
        "vacuna": "Hepatitis B",
        "paciente": "Guillermo Samu Ramón Pazos",
        "fecha": "2025-05-22",
        "dosis": "Refuerzo",
        "centro": "Hospital Vargas"
    },
    {
        "id": 2,
        "vacuna": "COVID-19",
        "paciente": "Evangelina Garcia Sánchez",
        "fecha": "2025-01-23",
        "dosis": "Única",
        "centro": "Centro Santa Mónica"
    },
    {
        "id": 3,
        "vacuna": "Sarampión",
        "paciente": "Saturnino Soto Barral",
        "fecha": "2025-03-12",
        "dosis": "2da Dosis",
        "centro": "Centro Santa Mónica"
    },
    {
        "id": 4,
        "vacuna": "COVID-19",
        "paciente": "Delfina Agustín",
        "fecha": "2025-04-23",
        "dosis": "Única",
        "centro": "Centro La Pastora"
    },
    {
        "id": 5,
        "vacuna": "COVID-19",
        "paciente": "Gilberto Bernad Armengol",
        "fecha": "2025-01-20",
        "dosis": "2da Dosis",
        "centro": "Centro Santa Mónica"
    },
    {
        "id": 6,
        "vacuna": "Hepatitis B",
        "paciente": "Paula Marí Ballester",
        "fecha": "2024-07-02",
        "dosis": "Refuerzo",
        "centro": "Centro La Pastora"
    },
    {
        "id": 7,
        "vacuna": "Tétanos",
        "paciente": "Obdulia Vizcaíno Serrano",
        "fecha": "2025-04-01",
        "dosis": "1ra Dosis",
        "centro": "Hospital Vargas"
    },
    {
        "id": 8,
        "vacuna": "Sarampión",
        "paciente": "Carmen Taboada Higueras",
        "fecha": "2024-09-09",
        "dosis": "Refuerzo",
        "centro": "Centro La Pastora"
    },
    {
        "id": 9,
        "vacuna": "Influenza",
        "paciente": "Jesusa Rosales-Marco",
        "fecha": "2024-10-30",
        "dosis": "Refuerzo",
        "centro": "Centro Santa Mónica"
    },
    {
        "id": 10,
        "vacuna": "COVID-19",
        "paciente": "Aurelia Rafaela Gallardo Piñeiro",
        "fecha": "2024-12-08",
        "dosis": "1ra Dosis",
        "centro": "Hospital Vargas"
    },
    {
        "id": 11,
        "vacuna": "Sarampión",
        "paciente": "Augusto Segarra-Pascual",
        "fecha": "2025-03-06",
        "dosis": "Refuerzo",
        "centro": "Hospital Vargas"
    },
    {
        "id": 12,
        "vacuna": "Influenza",
        "paciente": "Osvaldo del Pereira",
        "fecha": "2024-08-05",
        "dosis": "Única",
        "centro": "Centro Santa Mónica"
    },
    {
        "id": 13,
        "vacuna": "Tétanos",
        "paciente": "Atilio Puente",
        "fecha": "2024-12-29",
        "dosis": "Única",
        "centro": "Centro Santa Mónica"
    },
    {
        "id": 14,
        "vacuna": "Sarampión",
        "paciente": "Merche Viviana Colomer Arnaiz",
        "fecha": "2024-12-18",
        "dosis": "Única",
        "centro": "Centro Santa Mónica"
    },
    {
        "id": 15,
        "vacuna": "Hepatitis B",
        "paciente": "Merche Díez",
        "fecha": "2024-08-13",
        "dosis": "1ra Dosis",
        "centro": "Ambulatorio San José"
    },
    {
        "id": 16,
        "vacuna": "Sarampión",
        "paciente": "Juan José Carretero Luque",
        "fecha": "2024-08-01",
        "dosis": "Única",
        "centro": "Centro El Valle"
    },
    {
        "id": 17,
        "vacuna": "Influenza",
        "paciente": "Juan Román-Lozano",
        "fecha": "2024-09-11",
        "dosis": "Única",
        "centro": "Ambulatorio San José"
    },
    {
        "id": 18,
        "vacuna": "Influenza",
        "paciente": "Pío Sala Nadal",
        "fecha": "2025-05-17",
        "dosis": "Refuerzo",
        "centro": "Centro El Valle"
    },
    {
        "id": 19,
        "vacuna": "Hepatitis B",
        "paciente": "Josué Álvaro-Campo",
        "fecha": "2024-08-25",
        "dosis": "Única",
        "centro": "Ambulatorio San José"
    },
    {
        "id": 20,
        "vacuna": "COVID-19",
        "paciente": "Amparo Tejada Casals",
        "fecha": "2024-12-01",
        "dosis": "Refuerzo",
        "centro": "Centro La Pastora"
    },
];

const headers = [
    { title: 'Vacuna', value: 'vacuna' },
    { title: 'Paciente', value: 'paciente' },
    { title: 'Fecha', value: 'fecha' },
    { title: 'Dosis', value: 'dosis' },
    { title:'Centro de Salud', value: 'centro' },
    { title: 'Acciones', value: 'acciones', sortable: false }
]

const obtenerVacunas = async () => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    vacunas.value = [...datosFalsos]
    loading.value = false

    // Funcionalidad backend aqui:
    // const token = localStorage.getItem('token')
    // const res = await axios.get('/api/vacunas-aplicadas', {
    //     headers: { Authorization: `Bearer ${token}` }
    // })
    // vacunas.value = res.data
    // loading.value = false
}

const abrirModal = (item) => {
    form.value = { ...item }
    modal.value = true
}

const guardarCambios = async () => {
    const index = vacunas.value.findIndex(v => v.id === form.value.id)
    if (index !== -1) {
        vacunas.value[index] = { ...form.value }
    }
    modal.value = false

    // Funcionalidad backend aqui:
    // const token = localStorage.getItem('token')
    // await axios.put(`/api/vacunas-aplicadas/${form.value.id}`, form.value, {
    // headers: { Authorization: `Bearer ${token}` }
    // })
    // modal.value = false
    // obtenerVacunas()
}

const borrarVacuna = async (id) => {
    if (!confirm('¿Estás seguro de borrar esta vacuna?')) return
    vacunas.value = vacunas.value.filter(v => v.id !== id)

    // Funcionalidad backend aqui:
    // if (!confirm('¿Estás seguro de borrar esta vacuna?')) return
    // const token = localStorage.getItem('token')
    // await axios.delete(`/api/vacunas-aplicadas/${id}`, {
    //     headers: { Authorization: `Bearer ${token}` }
    // })
    // obtenerVacunas()
}

// Filtro de busqueda
// Normalizar texto del input
const normalizar = (str) => str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
// Filtrar
const vacunasFiltradas = computed(() => {
    const texto = normalizar(busqueda.value)
    return vacunas.value.filter(v => {
    return (
        normalizar(v.vacuna).includes(texto) ||
        normalizar(v.paciente).includes(texto) ||
        normalizar(v.centro).includes(texto) ||
        normalizar(v.fecha).includes(texto) ||
        normalizar(v.dosis).includes(texto)
    )
    })
})

onMounted(obtenerVacunas)
</script>