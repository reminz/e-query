<template>
  <div>
    <div class="query-title">
      <p style="text-align: center;font-size: 1.4em;color: aliceblue">{{query.title}}</p>
    </div>
    <div class="query-content">
      <div class="query-content-header">
        <p></p>
        <p>
          <span style="color:rgb(102, 102, 102)">
            <span style="font-size: 1.2em">
              {{query.des}}
            </span>
          </span>
        </p>
        <span></span>
        <span></span>
        <p>&nbsp;</p>
        <span></span>
        <span></span>
        <p style="text-align: right;">
          <span style="color:rgb(102, 102, 102)">
            <span style="font-size:16px">
              —— &nbsp;中国疾病预防控制中心
            </span>
          </span>
        </p>
        <span></span>
        <span></span>
        <p style="text-align: right;">
          <span style="color:rgb(102, 102, 102)">
            <span style="font-size:16px">
              妇幼保健中心
            </span>
          </span>
        </p>
        <span></span>
        <span></span>
        <p style="text-align: right;">
          <span style="color:rgb(102, 102, 102)">
            <span style="font-size:16px">
              上海交通大学身心健康研究所
            </span>
          </span>
        </p>
      </div>
      <div class="query-content-item" v-for="question in query.questions" :key="question.id" :id="question.id">
        <div class="query-content-item-question">
          <p>
            {{question.title}}
          </p>
        </div>
        <div class="query-content-item-choice" v-if="question.type == 'single'">
          <ul class="list-group">
            <li class="list-group-item" v-for="(choice,index) in question.choices" :key="choice">
              <div class="radio">
                <label>
                  <input type="radio" :name="question.title" id="optionsRadios1" :value="index" v-model="question.answer" checked> {{choice}}
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div class="query-content-item-choice" v-if="question.type == 'multi'">
          <ul class="list-group">
            <li class="list-group-item" v-for="(choice, index) in question.choices" :key="choice">
              <div class="checkbox">
                <label>
                  <input type="checkbox" :value="index" v-model="question.answer"> {{choice}}
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div class="query-content-item-choice" v-if="question.type == 'input'">
          <form>
            <div class="form-group" v-for="(choice, index) in question.choices" :key="choice">
              <label :for="choice">{{choice}}</label>
              <input type="email" class="form-control" :id="choice" placeholder="..." v-model="question.answer[index]">
            </div>
          </form>
        </div>
      </div>
      <div class="query-content-item">
        <button type="button" class="btn btn-warning btn-lg btn-block" @click="submit">提交</button>
      </div>
    </div>
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">{{message.title || '提示'}}</h4>
          </div>
          <div class="modal-body">{{message.des || '请稍候'}}</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal -->
    </div>
  </div>
</template>

<script>

  import { query } from '../query'
  import * as Api from '../api'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        user_info: null,
        query: {},
        answer: {},
        input: {},
        score: {},
        user_score: 0,
        message: {
          title: '',
          des: ''
        }
      }
    },
    created() {
      $('body').css({ 'background-color': '#FAEBD7' })
      this.checkLogin()
      this.query = query
      if (query && query[this.$route.params.query]) {
        this.query = query[this.$route.params.query]
        this.query.questions.forEach(item => {
          item['answer'] = []
        })
        this.score = query.answer[this.$route.params.query]
      } else {
        this.$router.push({ path: '/' })
      }
    },
    methods: {
      checkLogin: function () {
        if (!this.user_info) {
          let thiz = this
          Api.getLoginInfo(function (res) {
            if (res.ret === 1) {
              thiz.user_info = res.data
            } else {
              thiz.user_info = null
              thiz.message.title = '提示'
              thiz.message.des = '获取登陆信息失败，请刷新重试'
              $('#myModal').modal('show')
            }
          })
        }
      },
      submit: function () {
        let thiz = this
        if (!this.user_info) {
          this.message.title = '提示'
          this.message.des = '您尚未登陆，请刷新重试'
          $('#myModal').modal('show')
          setTimeout(function () {
            $('#myModal').modal('hide')
            location.reload();
          }, 1000)
          return 
        }

        let question = this.checkAnswer()
        if (question) {
          $("html,body").animate({ scrollTop: $(`#${question.id}`).offset().top }, 50);
          return
        }
        this.user_score = this.getScore()
        let data = {
          'title': this.$route.params.query,
          'answer': this.answer,
          'user_id': this.user_info.id,
          'score': this.user_score
        }
        thiz.message.title = '提示'
        thiz.message.des = '问卷提交中，请稍后。。。'
        $('#myModal').modal('show')
        Api.postAnswer(data, function (res) {
          if (res.ret === 1) {
            thiz.message.des = '恭喜您，问卷提交成功！'
            setTimeout(function () {
              $('#myModal').modal('hide')
              thiz.$router.push({ name: 'result', params: { query: thiz.$route.params.query, score: thiz.user_score } })
            }, 1000)
          } else {
            thiz.message.des = `问卷提交失败，${res.msg}！`
            setTimeout(function () {
              $('#myModal').modal('hide')
            }, 5000)
          }
        })
      },
      checkAnswer: function () {
        for (let index in this.query.questions) {
          let question = this.query.questions[index]
          if (question.type === 'single' && !(question.answer === +question.answer)) {
            return question
          }
          if (question.type === 'multi' && question.answer.length === 0) {
            return question
          }
          if (question.type === 'input' && question.answer.length !== question.choices.length) {
            for (let i = 0; i < question.choices.length; i++) {
              if (!question.answer[i]) {
                this.message.des = '请填写' + question.choices[i]
                $('#myModal').modal('show')
                setTimeout(function () {
                  $('#myModal').modal('hide')
                }, 1500)
                return question
              }
            }
          }
        }
        return false
      },
      getScore: function () {
        let tmp_score = 0
        this.answer = {}
        for (let index in this.query.questions) {
          let question = this.query.questions[index]
          let key = parseInt(index) + 1
          this.answer[key] = question.answer
          if (question.type === 'single' && (question.answer === +question.answer)) {
            tmp_score += this.score[key][question.answer]
          }
        }
        return tmp_score
      }
    }
  }
</script>

<style>
  .query-title {
    background-color: #ff7f66;
    padding: .625rem;
    width: 100%;
  }

  .query-content-header {
    padding: 10px 10px 0;
    background-size: contain;
  }

  .query-content-item {
    margin-top: 13px;
    margin-bottom: 22px;
    padding: 10px 10px 0;
  }
</style>