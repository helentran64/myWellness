import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/global.css'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
