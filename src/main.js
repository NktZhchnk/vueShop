import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from "@/router/router.js";

import {library} from "@fortawesome/fontawesome-svg-core";

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import {faUserSecret} from "@fortawesome/free-solid-svg-icons";



const app = createApp(App)

app.use(createPinia())

library.add(faUserSecret)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
