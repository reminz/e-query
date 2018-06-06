<template>
  <div class="container-fluid">
    <div style="margin: 2em"></div>
    <div class="list-group">
      <a href="#" class="list-group-item list-group-item-success">
        <h4 class="list-group-item-heading result-head">评分</h4>
        <p class="list-group-item-text result-des">{{user_score}}</p>
      </a>
      <a href="#" class="list-group-item list-group-item-info">
        <h4 class="list-group-item-heading result-head">级别</h4>
        <p class="list-group-item-text result-des">{{press_level}}</p>
      </a>
      <a href="#" class="list-group-item list-group-item-warning">
        <h4 class="list-group-item-heading result-head">当前情况</h4>
        <p class="list-group-item-text result-des">{{status.summary}}</p>
        <p class="list-group-item-text result-des" v-for="(item,index) in status.des">({{index+1}}) {{item}}</p>
      </a>
      <a href="#" class="list-group-item list-group-item-danger">
        <h4 class="list-group-item-heading result-head">改善意见</h4>
        <p class="list-group-item-text result-des" >{{recommend.summary}}</p>
        <p class="list-group-item-text result-des" v-for="(item,index) in recommend.des">({{index+1}}) {{item}}</p>
      </a>
    </div>
  </div>
</template>

<script>
  import { query } from '../query'
  export default {
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        user_score: '未完成问卷',
        press_level: '未知',
        status: '未知',
        recommend: '未知',
      }
    },
    created() {
      $('body').css({ 'background-color': '#FAEBD7' })
      this.init()
    },
    methods: {
      init: function () {
        let score = parseInt(this.$route.params.score)
        if (score === +score) this.user_score = score
        else this.$router.push({ path: '/' })
        let pressTable = query.pressTable
        for (let index = 0; index < pressTable.length; index++) {
          let element = pressTable[index];
          if (score >= element.min && score <= element.max) {
            this.press_level = element.level || '未知'
            this.status = element.status || '未知'
            this.recommend = element.recommend || '未知'
            return
          }
        }
      }
    }
  }
</script>

<style scoped>
  .result-head {
    color: black,
  }
  .result-des {
    color: dimgrey
  }
</style>