import Vuex from 'vuex'
import {setTokens} from '@/utils/util'

export default Vuex.createStore({
    state:{
        token:'',
        openid:''
    },
    getters:{
        token:state=>state.token
    },
    mutations:{
        setOpenid(state,id){
            if(id){
                state.openid = id
            }
        },
        setToken(state,token){
            // console.log('set',token)
            if(token){
                state.token = token
            }
        setTokens(token)
        }
    }
})