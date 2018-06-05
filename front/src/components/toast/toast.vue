<template>
  <div class = "OHSToast-container" v-show = "isShow">
    <transition name = "fade">
      <div id = "OHSToast">
        <div class = "OHSToast-image" :style = "{backgroundImage:'url(' + icon + ')',width:width + 'px',height:height + 'px'}"></div>
        <text class = "OHSToast-text">{{ text }}</text>
      </div>
    </transition>
  </div>
</template>

<script>
import event from '../../event'

export default {
  data () {
    return {
      types: {
        'success': {
          duration: 1500,
          icon: require('@/assets/toast_success.png'),
          text: '成功',
          width: this.rpx(99),
          height: this.rpx(71)
        },
        'fail': {
          duration: 2000,
          icon: require('@/assets/toast_fail.png'),
          text: '失败',
          width: this.rpx(103),
          height: this.rpx(103)
        },
        'loading': {
          duration: 10000,
          icon: require('@/assets/toast_loading.gif'),
          text: '数据加载中',
          width: this.rpx(52),
          height: this.rpx(52)
        }
      },
      width: this.rpx(99),
      height: this.rpx(71),
      icon: '',
      text: '',
      isShow: false,
      duration: 1500,
      type: 'success'
    }
  },
  created () {
    var self = this
    event.addEventListener('toast', function (data) {
      if (data.type && self.types[data.type]) {
        let params = self.types[data.type]
        self.duration = params.duration
        self.icon = params.icon
        self.text = params.text
        self.width = params.width
        self.height = params.height

        self.type = data.type
      }

      if (data.icon) self.icon = data.icon
      if (data.text) self.text = data.text
      if (data.duration) self.duration = data.duration

      self.show()
    })

    event.addEventListener('toast_loading_start', function () {
      self.type = 'loading'
      let params = self.types[self.type]
      self.duration = params.duration
      self.icon = params.icon
      self.text = params.text
      self.width = params.width
      self.height = params.height
      self.show()
    })

    event.addEventListener('toast_loading_end', function () {
      if (self.type === 'loading' && self.isShow) {
        self.hide()
      }
    })
  },
  methods: {
    show: function () {
      this.isShow = true
      var self = this
      setTimeout(function () {
        self.isShow = false
      }, this.duration)
    },
    hide: function () {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
  .OHSToast-container{
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
  z-index: 999999;
}

#OHSToast {
  top: -100px;
  justify-content: flex-start;
  align-items: center;
  width: 240px;
  height: 240px;
  background-image: linear-gradient(to bottom, RGBA(246,245,242,1), RGBA(226,224,218,1));
  flex-direction: column;
  justify-content: space-around;
  border-radius: 10px;
}

#OHSToast .OHSToast-image {
  bottom: -30px;
  background-repeat: no-repeat;
  background-size: cover;
}

#OHSToast .OHSToast-text {
  color: #ad7a00;
  font-size: 26px;
  align-content: center;
}

</style>
