import Mock from 'mockjs'
import {login,sendCapt,getList,recharge,wxPay} from './data'
Mock.mock(/\/phone\/login/,login)
Mock.mock(/\/get\/sms/,'get',sendCapt)
Mock.mock(/\/card\/select/,'get',getList())
Mock.mock(/\/card\/recharge/,recharge)
Mock.mock(/\/wx\/pay/,wxPay)
Mock.mock(/\/card\/unbundle/,{code:'200'})
export default Mock