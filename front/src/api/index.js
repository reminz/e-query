import * as Net from './net.js'

export function getLoginInfo (callback) {
  Net.request('GET', '/wyeth/user/getLoginInfo', {}, callback)
}

export function postAnswer (data, callback) {
  Net.request('POST', '/survey/submit', data, callback)
}
