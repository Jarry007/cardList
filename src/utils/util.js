import cookie from 'js-cookie'

const tokenLabel = 'tokenJ'

export const setTokens = (token) => {
    cookie.set(tokenLabel, token || '', { expires: 1 })
}

export const getToken = () => {
    const token = cookie.get(tokenLabel)
    if (token) return token
    return false
}

export const checkPhone = (phone) => {
    const _rule = /^[1][3,4,5,6,7,8,9]\d{9}$/
    return _rule.test(phone)
}

export const debounce = function (fn, wait) {
    let _timeOut

    return function () {
        if (_timeOut) clearTimeout(_timeOut)
        let _fnRun = !_timeOut
        _timeOut = setTimeout(() => {
            _timeOut = false
        }, wait)

        if (_fnRun) fn.apply(this, arguments)

    }
}

export const throttle = function (fn, wait) {
    let _fnRun = true
    return function () {
        if (!_fnRun) return

        _fnRun = false
        fn.apply(this, arguments)
        setTimeout(() => {
            _fnRun = true
        }, wait)
    }
}

export const getParams = function (key) {
    const reg = new RegExp('(^|$)' + key + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r) return unescape(r[2])
    return null
}

export const isWeXin = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') return true;
  
    return false;
    
}

