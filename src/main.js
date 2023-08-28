import { createApp } from 'vue'
import App from './App.vue'
import WaveUI from 'wave-ui/src/wave-ui'
import router from './router'
import store from './store'
import components from '@/components';

const app = createApp(App);

components.forEach(c => {
    app.component(c.name, c);
})

app
    .use(WaveUI, {theme: 'auto'})
    .use(store)
    .use(router)
    .mount('#app')
