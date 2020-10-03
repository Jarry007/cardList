import {createRouter, createWebHistory} from 'vue-router'
import routes from './router'
import {getToken} from '@/utils/util'
const router = createRouter({
    history:createWebHistory(process.env.BASE_URL),
    routes:routes
})

const loginPage = 'Home'
const indexPage = 'Index'
router.beforeEach(async(to,from,next)=>{
    const token = getToken()
    if(!token && to.name !==loginPage ){
        next({
            name:loginPage
        })
    }else if(!token && to.name === loginPage){
        next()
    }else if(token && to.name === loginPage){
        next({
            name:indexPage
        })
    }else{
        console.log('to')
        next()
    }
})

export default router