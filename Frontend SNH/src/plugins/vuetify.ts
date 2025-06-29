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
                    primary: '#1B856E',      
                    secondary: '#1F453D',    
                    accent: '#20cfa2',      
                    error: '#FC3E30',        
                    info: '#2196f3',         
                    success: '#43A148',      
                    warning: '#FFC800',
                    text:'1B856E'      
                }
            },
            SNHdark: {
                dark: true,
                colors: {
                    primary: '#1F453D',       
                    secondary: '#A3EFDE',    
                    accent: '#3B7A6A',       
                    error: '#C73126',        
                    info: '#90caf9',         
                    success: '#2A502C',      
                    warning: '#F0BC00',
                    text:'50BF56'     
                }
            }
        }
    },

})