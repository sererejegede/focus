import { createApp } from 'vue'
import App from './App.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import './registerServiceWorker'
import './assets/styles/index.css'

const app = createApp(App)
app.component('svg-icon', SvgIcon)
app.mount('#app')
