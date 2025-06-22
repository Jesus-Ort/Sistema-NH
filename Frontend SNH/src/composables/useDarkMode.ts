import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'

/**
 * Composable para gestionar el modo oscuro en la aplicación.
 *
 * Esta función proporciona una propiedad computada reactiva `isDark` para determinar si el tema actual es oscuro,
 * y una función `toggleDark` para alternar entre los temas claro y oscuro. El tema seleccionado se guarda
 * en `localStorage` y se inicializa al montar, ya sea desde el almacenamiento o detectando la preferencia del sistema operativo del usuario.
 *
 * return Un objeto que contiene:
 * - `isDark`: Un booleano computado que indica si el tema oscuro está activo.
 * - `toggleDark`: Una función para alternar entre los temas claro y oscuro.
 */
export function useDarkMode() {
    const theme = useTheme()
    const isDark = computed(() => theme.global.name.value === 'SNHdark')

    function toggleDark() {
        const newTheme = isDark.value ? 'SNH' : 'SNHdark'
        theme.global.name.value = newTheme
        localStorage.setItem('theme', newTheme)
    }

    onMounted(() => {
        const saved = localStorage.getItem('theme')
    if (saved) {
        theme.global.name.value = saved
    } else {
      // Opcional: detecta sistema operativo y asigna
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme.global.name.value = prefersDark ? 'SNHdark' : 'SNH'
    }
    })

    return { isDark, toggleDark }
}
