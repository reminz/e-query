import * as Net from './net.js'
const Base64 = require('js-base64').Base64
export function getLoginInfo (callback) {
  Net.request('GET', '/wyeth/user/getLoginInfo', { back_url: Base64.encode(window.location.pathname + window.location.hash) }, callback)
}

export function postAnswer (data, callback) {
  Net.request('POST', '/survey/submit', data, callback)
}

export function getAnswer (data, callback) {
  Net.request('GET', '/survey/list', data, callback)
}
