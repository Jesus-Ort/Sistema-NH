<template>
    <v-container>
        <v-responsive>
        <h1>Bienvenido a Convit</h1>
        <p>Panel principal del sistema de gestión de vacunas</p>
        </v-responsive>

        <v-container class="mt-5 text-center">
        <v-responsive>
            <h3>Gráfica de barras para dosis aplicada por centro de salud:</h3>

            <v-select
            class="mt-4"
            v-model="selectedCenterId"
            :items="centrosSalud"
            item-title="centerName"
            :item-value="'id'"
            :loading="loadingCentros"
            :disabled="loadingCentros"
            :rules="[val => !!val || 'Debe seleccionar un centro de salud válido']"
            label="Centro de Salud"
            prepend-icon="mdi-hospital-building"
            ></v-select>

            <DosisChart v-if="selectedCenterId" :centerId="selectedCenterId" :is-dark="isDark" />
        </v-responsive>
        </v-container>
    </v-container>
</template>

<script setup>
import DosisChart from '@/components/DosisChart.vue'
import { ref, onMounted} from 'vue'
import axios from '@/services/axios'
import { useSnackbar } from '@/composables/useSnackbar'
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark } = useDarkMode()
const centrosSalud = ref([])
const loadingCentros = ref(false)
const $snackbar = useSnackbar()

const selectedCenterId = ref(null)  // ESTA VARIABLE controlará el select y el prop

const cargarCentros = async () => {
    try {
        loadingCentros.value = true
        const res = await axios.get('/api/v1/vaccination-centers')
        centrosSalud.value = res.data.map(vb => ({
        id: vb.id,
        centerName: vb.centerName
        }))
    } catch (error) {
        const msg = error.response?.data?.message || 'Error al cargar los centros'
        $snackbar.error(`Algo salió mal al cargar los centros: ${msg}`)
    } finally {
        loadingCentros.value = false
    }
}

onMounted(() => {
    cargarCentros()
})
</script>
