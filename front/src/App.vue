<template>
  <div id="app">
    <router-view/>
    <!-- <toast></toast> -->
  </div>
</template>

<script>
// import * as Api from './api'
import event from './event'

export default {
  name: 'App',
  data () {
    return {
    }
  },
  created () {
    var self = this
    event.addEventListener('signup', function (hidden) {
      self.show_flase = true
    })
  }
}
</script>
