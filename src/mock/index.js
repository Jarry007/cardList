import Mock from 'mockjs'
import {login} from './data'
Mock.mock(/\/phone\/login/,login)

export default Mock