import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'


export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
        mdi,
    },
    },
    theme: {
        defaultTheme: 'SNH',
        themes: {
            SNH: {
                dark: false,
                colors: {
                    primary: '#209e83',      // Verde principal 
                    secondary: '#17695a',    // Verde oscuro complementario
                    accent: '#20cfa2',       // Verde menta claro
                    error: '#e57373',        // Rojo suave
                    info: '#2196f3',         // Azul informativo
                    success: '#43a047',      // Verde éxito
                    warning: '#ffb300'       // Amarillo cálido
                }
            },
            SNHdark: {
                dark: true,
                colors: {
                    primary: '#20cfa2',      // Verde menta claro 
                    secondary: '#1a2e2b',    // Verde oscuro profundo
                    accent: '#209e83',       // Verde principal como acento
                    error: '#ef9a9a',        // Rojo claro para dark
                    info: '#90caf9',         // Azul claro para dark
                    success: '#66bb6a',      // Verde éxito claro
                    warning: '#ffe082'       // Amarillo claro para dark
                }
            }
        }
    },

})