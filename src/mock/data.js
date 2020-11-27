import Mock from 'mockjs'
const random = Mock.Random
export function login(){
    return {
        code:'200',
        data:{
            token:random.string(21)
        }
    }
}

export function sendCapt(){
    return {
        code:'200',
        data:{
            code:random.integer(100000,999999)
        }
    }
}

export function getList (){
    return {
        code:'200',
        'data|3':[{
            "cardId|+1":1,
            "cardNum":()=>random.integer(10000000,99999999),
            "cardBalance":()=>random.float(0,100)

        }]
    }
}

export function recharge(){
    return{
        code:'200',
        data:{
            rechargeNum:random.string(21)
        }
        
    }
}

export function wxPay(){
    return {
        code:'200',
        data:'success'
    }
}