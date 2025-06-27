import { getCurrentInstance } from 'vue'

export function useSnackbar() {
    const { proxy } = getCurrentInstance()

    if (!proxy || !proxy.$snackbar) {
        throw new Error('$snackbar no está disponible. ¿Registraste el plugin?')
    }

    return proxy.$snackbar
}
