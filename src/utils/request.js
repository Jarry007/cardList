import axios from 'axios'

// import store from '@/store'
import {getToken} from './util'
// import { from } from 'core-js/fn/array'

// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// axios.defaults.headers['Access-Control-Allow-Origin'] = 'http://192.168.2.121'
// axios.defaults.headers['Access-Control-Allow-Credentials'] =true
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const service = axios.create({
    baseURL: '/user',
    timeout: 6000
})

service.interceptors.request.use(
    config => {
            if(getToken()){
                // console.log('getToken', getToken())
            // config.headers['Access-Control-Allow-Origin'] = '*'
            config.headers['Authorization'] = getToken()
            }
            
        
        return config
    },
    error => {
        return Promise.reject(error)
    }
)


service.interceptors.response.use(
    res => {
        // console.log(res)
        if (res.data.code === '200') {
            return res.data
        } else {
            return Promise.reject(res.data)
        }
    },
    error => {
        return Promise.reject(error)
    }

)

export default service




