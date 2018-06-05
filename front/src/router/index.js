import Vue from 'vue'
import Router from 'vue-router'
import Query from '@/views/Query'
import Result from '@/views/Result'
import Home from '@/views/Home'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      component: Home
    },
    {
      path: '/query/:query',
      name: 'query',
      component: Query
    },
    {
      path: '/result',
      name: 'result',
      component: Result
    }
  ]
})

export default router
