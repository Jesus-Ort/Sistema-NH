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
                    secondary: '#012F21',    
                    accent: '#20cfa2',      
                    error: '#e57373',        
                    info: '#2196f3',         
                    success: '#43A148',      
                    warning: '#ffb300',
                    text:'1B856E'      
                }
            },
            SNHdark: {
                dark: true,
                colors: {
                    primary: '#1F453D',       
                    secondary: '#A3EFDE',    
                    accent: '#3B7A6A',       
                    error: '#ef9a9a',        
                    info: '#90caf9',         
                    success: '#2A502C',      
                    warning: '#ffe082',
                    text:'50BF56'     
                }
            }
        }
    },

})