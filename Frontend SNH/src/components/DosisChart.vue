<template>
    <v-container fluid class="mt-10">
        <v-row justify="center">
        <v-col cols="12" sm="10" md="12">
            <v-sheet
            elevation="2"
            rounded
            :color="isDark ? '#23272f' : '#eee'"
            class="pa-6"
            >
            <!-- Selector de filtro -->
            <v-select
                v-model="filtro"
                :items="['Día', 'Semana', 'Mes']"
                label="Filtro"
                class="mb-4"
                :color="isDark ? 'text' : 'text'"
                :theme="isDark ? 'SNHdark' : 'SNH'"
                :style="{ color: isDark ? '#fff' : '#222' }"
            />

            <!-- Gráfico responsivo -->
            <div>
                <Bar :data="chartData" :options="chartOptions" />
            </div>
            </v-sheet>
        </v-col>
        </v-row>
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
    maintainAspectRatio: false,
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
