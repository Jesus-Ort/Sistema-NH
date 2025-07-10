<template>
    <v-card class="pa-4 mt-6" :class="props.isDark ? 'chart-dark' : 'chart-light'">
        <v-card-title class="text-h6">Dosis disponibles por lote</v-card-title>
        <!-- Gráfico -->
        <v-card-text>
            <div class="chart-container">
                <canvas ref="chartCanvas"></canvas>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import axios from '@/services/axios'

const props = defineProps({
    isDark: {
        type: Boolean,
        required: true
    }
})

const chartCanvas = ref(null)
let chartInstance = null

function procesarDatos(data) {
    const agrupadoPorLote = {}

    data.forEach(item => {
        const etiqueta = `Lote ${item.batchNumber} (${item.vaccine?.vaccineName || 'Desconocida'})`

        if (!agrupadoPorLote[etiqueta]) {
        agrupadoPorLote[etiqueta] = 0
        }

        agrupadoPorLote[etiqueta] += item.availableQuantity
    })

    return {
        labels: Object.keys(agrupadoPorLote),
        values: Object.values(agrupadoPorLote)
    }
}

function getThemeColor() {
    return props.isDark
        ? '#1B856E' // color para modo oscuro
        : '#1B856E' // color para modo claro (puedes cambiar)
}

async function crearGrafica() {
    try {
        const res = await axios.get('/api/v1/reports/vaccine-batch-availability')
        const { labels, values } = procesarDatos(res.data)

        if (chartInstance) {
            chartInstance.destroy()
        }

        const color = getThemeColor()

        chartInstance = new Chart(chartCanvas.value, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Dosis disponibles',
                    data: values,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // <-- Importante para responsividad
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad de dosis'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Lotes'
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.error('Error al cargar los datos de disponibilidad:', error)
    }
}

onMounted(() => {
    crearGrafica()
})

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.destroy()
    }
})
</script>

<style scoped>
.chart-container {
    width: 100%;
    min-height: 250px;
    height: 40vw;
    max-height: 500px;
    position: relative;
}
canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
}
.chart-dark {
  background-color: #222;
}
.chart-light {
  background-color: #ddd;
}
</style>
