import { createApp } from 'vue'
import components from './components/components.js';
import store from './store.js';
import App from './App.vue'

const app = createApp(App);

// Регистрируем все компоненты (пока их мало, но в будущем при развитии приложения их может стать много)
for (const name in components) {
    app.component(name, components[name]);
}

app
    .use(store) // Используем vuex для кэширования запросов
    .mount('#app')
