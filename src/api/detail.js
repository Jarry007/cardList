import request from '@/utils/request'

export function rechargeMoney (params){
    return request({
        url:'/card/recharge',
        method:'post',
        params:params
    })
}

export function unbindCards (params){
    return request({
        url:'/card/unbundle',
        method:'post',
        params:params
    })
}

export function wxPay (params){
    return request({
        url:'card/wx/pay',
        method:'post',
        params:params
    })
}
