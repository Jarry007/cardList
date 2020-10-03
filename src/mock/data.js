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