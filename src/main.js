import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar,Notify } from 'quasar'

import App from './App.vue'
import router from './router'
import moment from 'moment'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.config.globalProperties.$filters = {
    fromNow(value) {
        return moment(new Date(value), "YYYYMMDD").fromNow();
    }
}
app.use(Quasar,{
    plugins: {
        Notify
    }
})
app.use(createPinia())
app.use(router)

app.mount('#app')
