
import Vue from 'vue'
const QBus = new Vue()
export default {
  addEventListener: function (type, callback) {
    QBus.$on(type, function (data) {
      console.log('接收到' + type + ' ', data)
      callback(data)
    })
  },
  sendEvent: function (type, data) {
    console.log('发送 ' + type + ' ', data)
    QBus.$emit(type, data)
  }
}
