import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'

import {library} from "@fortawesome/fontawesome-svg-core";

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import {faUserSecret} from "@fortawesome/free-solid-svg-icons";


const app = createApp(App)

library.add(faUserSecret)

app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
