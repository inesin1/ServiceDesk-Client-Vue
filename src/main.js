import { createApp } from 'vue'
import App from './App.vue'
import WaveUI from 'wave-ui/src/wave-ui'
import router from './router'
import { createPinia } from 'pinia'
import components from '@/components';

const pinia = createPinia()
const app = createApp(App);

components.forEach(c => {
    app.component(c.name, c);
})

app
    .use(WaveUI, {theme: 'auto'})
    .use(pinia)
    .use(router)
    .mount('#app')
