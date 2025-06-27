<template>
    <v-dialog v-model="model" :max-width="maxWidth" transition="dialog-bottom-transition">
        <v-card>
        <v-card-title class="text-h6">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn text @click="cancelar" :disabled="loading">Cancelar</v-btn>
            <v-btn color="error" @click="confirmar" :disabled="loading">Confirmar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, watch, computed } from 'vue'
    import { useDisplay } from 'vuetify'

    const props = defineProps({
    modelValue: Boolean,
    title: {
        type: String,
        default: 'Confirmar Acción'
    },
    message: {
        type: String,
        default: '¿Estás seguro de que deseas continuar?'
    },
    loading: {
    type: Boolean,
    default: false
    }
    })
    const emit = defineEmits(['update:modelValue', 'confirm'])

    const model = ref(props.modelValue)
    watch(() => props.modelValue, val => model.value = val)
    watch(() => model.value, val => emit('update:modelValue', val))

    const { smAndDown } = useDisplay()
    const maxWidth = computed(() => (smAndDown.value ? '90%' : 500))

    const confirmar = () => {
    emit('confirm')
    model.value = false
    }
    const cancelar = () => {
    model.value = false
    }
</script>