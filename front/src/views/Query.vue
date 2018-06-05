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
                            <input type="radio" :name="question.title" id="optionsRadios1" :value="index" v-model="question.answer" checked>
                            {{choice}}
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
                              <input type="checkbox" :value="index" v-model="question.answer" >
                              {{choice}}
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
    </div>
</template>

<script>

import { query } from '../query'
import * as Api from '../api'
export default {
  name: 'HelloWorld',
  data () {
    return {
      query: {},
      answer: {},
      input: {}
    }
  },
  created () {
    Api.login()
    this.query = query
    if (query && query[this.$route.params.query]) {
      this.query = query[this.$route.params.query]
      this.query.questions.forEach(item => {
        item['answer'] = []
      })
    } else {
      this.$router.push({ path: '/' })
    }
  },
  methods: {
    submit: function () {
      let question = this.checkAnswer()
      if (question) {
        console.log(question)
      }
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
        if (question.type === 'multi') {
          for (let i in question.choice.length) {
            if (!(question.answer[i] === question.answer[i] + '')) {
              return question
            }
          }
        }
      }
      return false
    }
  }
}
</script>

<style>
.query-title{
  background-color: #ff7f66;
  padding: .625rem;
  width: 100%;
}

.query-content-header{
  padding: 10px 10px 0;
  background-size: contain;
}
.query-content-item{
  margin-top: 13px;
  margin-bottom: 22px;
  padding: 10px 10px 0;
}
</style>
