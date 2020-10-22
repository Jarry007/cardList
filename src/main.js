import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import {message} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
// import { from } from 'core-js/fn/array';
// import Element3 from 'element3'

if(process.env.NODE_ENV === 'development') require('@/mock')
const app = createApp(App)

const globalDatas = {
    a:'这是a',
    b:'this is b',
    c:'fields c'
}
app.config.productionTip = false;
app.provide('$message',message)
app.provide('_globalData',globalDatas)
// app.globalData = globalDatas
app.config.globalProperties.foo = 'foo'
app.use(Antd).use(router).use(store).mount('#app')


