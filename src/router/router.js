export default [
    {
        path:'/',
        name:'Home',
        component:()=>import ('@/views/login.vue'),
        meta:{
            title:'登录'
        }
    },
    {
        path:'/index',
        name:'Index',
        component:()=>import ('@/views/index.vue')
    },
    {
        path:'/detail',
        name:'Detail',
        component:()=>import ('@/views/detail.vue')
    }
]
