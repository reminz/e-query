import Vue from 'vue'
import Router from 'vue-router'
import Query from '@/components/Query'
import Result from '@/components/Result'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'query',
      component: Query
    },
    {
      path: 'result',
      name: 'result',
      component: Result
    }
  ]
})
