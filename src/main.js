import { createApp } from 'vue'
import App from './App.vue'

// Estilos globales
import './style.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Plugins globales
import router from './router.js'
import pinia from './pinia.js'
import i18n from './i18n.js'

// PrimeVue
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import { definePreset } from '@primeuix/themes'

// Servicios PrimeVue
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'

// Opcional: preset genérico basado en Material
const LocalFoodPreset = definePreset(Material, {
    semantic: {
        primary: {
            50:  '#e9f5ff',
            100: '#c9e6ff',
            200: '#9fd4ff',
            300: '#6dbfff',
            400: '#38a8ff',
            500: '#0f91ff',   // color principal genérico azul
            600: '#0a78d6',
            700: '#065fae',
            800: '#034687',
            900: '#002f61'
        }
    }
})

const app = createApp(App)

// PrimeVue con preset neutral (editables a futuro)
app.use(PrimeVue, {
    theme: {
        preset: LocalFoodPreset
    }
})

// PrimeVue services
app.use(ConfirmationService)
app.use(DialogService)
app.use(ToastService)

// Plugins globales
app.use(router)
app.use(pinia)
app.use(i18n)

app.mount('#app')
