import { createApp } from 'vue'
import App from './App.vue'
import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'
import router from './router'
import store from './store'
import components from '@/components';

const app = createApp(App);

components.forEach(c => {
    app.component(c.name, c);
})

app
    .use(WaveUI, {theme: 'dark'})
    .use(store)
    .use(router)
    .mount('#app')
