import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import VueCarousel from 'vue-carousel'


const app = createApp(App)

app.use(createPinia())

app.use(VueCarousel)
app.mount('#app')
