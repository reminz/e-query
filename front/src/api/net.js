import axios from 'axios'

const config = require('../config.json')
const host = process.env.NODE_ENV === 'production' ? config.online_host : config.dev_host
const timeout = process.env.NODE_ENV === 'production' ? config.online_timeout : config.dev_timeout
axios.defaults.timeout = timeout
axios.defaults.baseURL = host

function appendParams (url, params = {}) {
  let str = ''
  for (let key in params) {
    str += encodeURI(key) + '=' + encodeURI(params[key]) + '&'
  }
  if (str.length > 0) {
    str = str.substr(0, str.length - 1)
    url += '?' + str
  }
  return url
}

function equeue (method, url, data, callback) {
  if (method === 'GET' && data) {
    url = appendParams(url, data)
  }
  let fn = function (n) {
    axios({
      withCredentials: true,
      method: method,
      url: url,
      data: data
    }).then(function (response) {
      if (callback) callback(response)
    }).catch(function (error) {
      if (n < 2) {
        error.ret = error.ret ? error.ret : -1
        error.msg = error.msg || '网络请求失败'

        if (callback) callback(error)
      } else {
        fn(n - 1)
      }
    })
  }
  return fn(2)
}
export function request (method, url, data, callback, hideLoading) {
  function networkResponse (response) {
    let error = {}

    if (response.status === 200) {
      var res = response.data
      if (!res.ret) {
        res = JSON.parse(res)
      }
      if (res.ret === 1) {
        // 请求成功
        if (callback) {
          callback(res)
        }
      } else {
        error.ret = res.ret ? res.ret : -1
        error.msg = res.msg ? res.msg : '获取数据失败'

        if (res.login_url) {
          error.msg = '正在跳转登录'
          if (callback) {
            callback(error)
          }
          // 跳转登录
          window.location.href = res.login_url
        }
        if (callback) {
          callback(error)
        }
      }
    } else {
      error.ret = response.status ? response.status : -1
      error.msg = response.msg || '网络请求失败'

      if (callback) {
        callback(error)
      }
    }
  }
  equeue(method, url, data, networkResponse)
}
