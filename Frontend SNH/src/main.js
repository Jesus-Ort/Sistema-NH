import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import SnackbarPlugin from '@/plugins/snackbar'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(SnackbarPlugin)


app.mount('#app')
