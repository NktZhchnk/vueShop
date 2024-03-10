import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from "@/router/router.js";
import "swiper/css"
import "swiper/css/bundle"


import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faUserSecret} from "@fortawesome/free-solid-svg-icons";


const app = createApp(App)

if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
        if (newModule) {
            // Обработка обновлений

            // Перезагрузка компонента App.vue
            if (newModule.default) {
                // Удаляем старый компонент App.vue из приложения
                app.unmount('#app');
                // Подключаем новый компонент App.vue
                app.component('App', newModule.default);
                // Перезапускаем приложение
                app.mount('#app');
            }

            // Выполните другие необходимые действия для обновления вашего приложения
        }
    });
}

app.use(createPinia())

library.add(faUserSecret)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
