import { createApp } from 'vue'
import { createPinia } from 'pinia'
import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'
import '@mdi/font/css/materialdesignicons.min.css'
import App from './App.vue'
import router from './router'
import components from '@/components'

const app = createApp(App)

Object.entries(components).forEach(([name, component]) => app.component(name, component))

app
  .use(WaveUI, { theme: localStorage.getItem('theme') ?? 'auto' })
  .use(createPinia())
  .use(router)
  .mount('#app')
