import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'

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
