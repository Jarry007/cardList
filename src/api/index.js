import request from '@/utils/request'

export function getCardList (){
    return request({
        url:'/card/select',
        method:'get',
        // params:params
    })
}

export function bindCards (params){
    return request({
        url:'/card/binding',
        method:'post',
        params:params
    })
}


export function getOpenid (code){
    return request({
        url:'card/get/openid',
        method:'post',
        params:code
    })
}
