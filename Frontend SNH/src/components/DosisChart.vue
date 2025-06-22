<!--
DosisChart.vue

Este componente muestra una gráfica de barras interactiva para visualizar 
la cantidad de dosis aplicadas, permitiendo filtrar los datos por día, 
semana o mes. Utiliza Vuetify para el diseño y vue-chartjs (basado en Chart.js) 
para la visualización de datos.

Props: 
- No recibe props externas.

Composición:
- Usa el composable `useDarkMode` para adaptar el tema (oscuro/claro) dinámicamente.
- Permite seleccionar el filtro de visualización ('Día', 'Semana', 'Mes') 
mediante un `v-select`.
- Los datos de ejemplo están definidos localmente en el objeto `datos`, 
pero pueden ser reemplazados por datos provenientes de una base de datos.
- El gráfico se actualiza automáticamente al cambiar el filtro seleccionado.

Variables principales:
- `filtro`: Reactive ref que almacena el filtro seleccionado.
- `isDark`: Reactive ref que indica si el modo oscuro está activo.
- `datos`: Objeto con los datos de ejemplo para cada filtro.
- `chartData`: Computed que genera los datos para el gráfico según el filtro seleccionado.
- `chartOptions`: Computed que configura las opciones visuales del gráfico, adaptándose 
al tema.

Dependencias:
- Vue 3
- Vuetify
- vue-chartjs
- chart.js

Uso:
Importar y utilizar el componente donde se requiera mostrar la gráfica de dosis aplicadas, 
asegurándose de tener configurado el tema y las dependencias necesarias.
-->
<template>
    <v-container class="mt-10" :style="{ background: isDark ? '#23272f' : '#eee', borderRadius: '16px', padding: '32px' }">
        <v-responsive class="mx-auto" max-width="800" aspect-ratio="16/9">
            <div>
                <v-select
                    v-model="filtro"
                    :items="['Día', 'Semana', 'Mes']"
                    label="Filtro"
                    class="mb-4"
                    :color="isDark ? 'secondary' : 'primary'"
                    :theme="isDark ? 'SNHdark' : 'SNH'"
                    :style="{ color: isDark ? '#fff' : '#222', borderRadius: '8px' }"
                />
                <Bar :data="chartData" :options="chartOptions" />
            </div>
        </v-responsive>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const filtro = ref('Día')

const { isDark } = useDarkMode()

// Montar datos desde la DB
const datos = {
    Día: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        values: [20, 35, 40, 25, 30]
    },
    Semana: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        values: [120, 150, 100, 170]
    },
    Mes: {
        labels: ['Enero', 'Febrero', 'Marzo',
            'Abril','Mayo', 'Junio',
            'Julio', 'Agosto','Septiembre',
            'Octubre', 'Noviembre', 'Diciembre'],
        values: [400, 520, 480,
            300, 250, 400,
            350, 600, 520,
            400,360,320]
    }
}

const chartData = computed(() => ({
    labels: datos[filtro.value].labels,
    datasets: [
        {
            label: 'Dosis aplicadas',
            backgroundColor: '#1B856E',
            borderColor: 'fff',
            data: datos[filtro.value].values
        }
    ]
}))

const chartOptions = computed(() => ({
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: isDark.value ? '#fff' : '#222'
            },
            position: 'top'
        },
        title: {
            display: true,
            text: 'Dosis Aplicadas',
            color: isDark.value ? '#fff' : '#222'
        }
    },
    scales: {
        x: {
            ticks: {
                color: isDark.value ? '#fff' : '#222'
            },
            grid: {
                color: isDark.value ? '#444' : '#aaa'
            }
        },
        y: {
            ticks: {
                color: isDark.value ? '#fff' : '#222'
            },
            grid: {
                color: isDark.value ? '#444' : '#aaa'
            }
        }
    },
    backgroundColor: isDark.value ? '#23272f' : '#fff'
}))
</script>
