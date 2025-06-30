<template>
    <v-card class="pa-4" :class="props.isDark ? 'chart-dark' : 'chart-light'">
        <v-card-title class="text-h6">
        Dosis aplicadas por vacuna
        </v-card-title>
        <v-card-text>
        <!-- Canvas para el gráfico -->
        <canvas ref="chartCanvas" :class="{'dark-mode': props.isDark}"></canvas>

        <!-- Indicadores de estado -->
        <v-alert v-if="loading" type="info" class="mt-4">Cargando datos...</v-alert>
        <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import axios from '@/services/axios'

// PROPS: recibe el centerId y el isDark
const props = defineProps({
    centerId: {
        type: String,
        required: true
    },
    isDark: {
        type: Boolean,
        required: true
    }
})

const chartCanvas = ref(null)
let chartInstance = null

const loading = ref(false)
const error = ref(null)

// Función para obtener el color del theme según isDark
function getThemeColor() {
    return props.isDark
        ? '#1B856E' // barras claras en modo oscuro
        : '#1B856E'   // barras oscuras en modo claro
}

// Obtiene los datos y arma el gráfico
async function fetchAndRenderChart() {
    loading.value = true
    error.value = null

    try {
        const response = await axios.get('/api/v1/reports/doses-applied', {
        params: { centerId: props.centerId }
        })

        const rawData = response.data.items || []

        // Agrupar datos
        const dataMap = {}
        rawData.forEach(item => {
        const date = item.applicationDateTime.split('T')[0]
        const vaccine = item.vaccineBatch.vaccine.vaccineName
        if (!dataMap[date]) dataMap[date] = {}
        if (!dataMap[date][vaccine]) dataMap[date][vaccine] = 0
        dataMap[date][vaccine]++
        })

        const labels = Object.keys(dataMap).sort()
        const vaccineNames = Array.from(new Set(rawData.map(i => i.vaccineBatch.vaccine.vaccineName)))

        const color = getThemeColor()

        const datasets = vaccineNames.map(vaccine => ({
        label: vaccine,
        backgroundColor: color,
        data: labels.map(date => dataMap[date][vaccine] || 0)
        }))

        renderChart(labels, datasets)
    } catch (err) {
        console.error(err)
        error.value = 'Ocurrió un error al cargar los datos.'
    } finally {
        loading.value = false
    }
    }

    // Renderiza o actualiza el gráfico
function renderChart(labels, datasets) {
    if (chartInstance) chartInstance.destroy()
    chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
        labels,
        datasets
        },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
        }
    })
}

// Montaje y reacción a cambios
onMounted(fetchAndRenderChart)
watch(() => props.centerId, fetchAndRenderChart)
watch(() => props.isDark, fetchAndRenderChart) // para refrescar color si cambia modo
</script>

<style scoped>
canvas {
    max-height: 400px;
    width: 100% !important;
    height: 400px !important;
}
.chart-dark {
  background-color: #222; /* O el color que uses para fondo oscuro */
}

.chart-light {
  background-color: #ddd; /* O tu fondo claro */
}
</style>
