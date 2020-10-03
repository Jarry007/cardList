import request from '@/utils/request'

export function getCaptcha (params){
    return request({
        url:'/user/get/sms',
        method:'get',
        params:params
    })
}

export function goCheck(params){
    return request({
        url:'/user/phone/login',
        method:'post',
        params:params
    })
}
export function login (params){
    return request({
        url:'/user/wx/register/login',
        method:'post',
        params:params
    })
}

export function getInfo (){
    return request({
        url:'/getInfo',
        method:'get'
    })
}