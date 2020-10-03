import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import store from './store'
if(process.env.NODE_ENV === 'development') require('@/mock')
// import store from './'
createApp(App).use(router).use(store).mount('#app')
