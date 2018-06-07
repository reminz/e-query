import Vue from 'vue'
import Router from 'vue-router'
import Query from '@/views/Query'
import Result from '@/views/Result'
import Home from '@/views/Home'
import List from '@/views/List'

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
      path: '/list',
      component: List
    },
    {
      path: '/query/:query',
      name: 'query',
      component: Query
    },
    {
      path: '/query/:query/score/:score',
      name: 'result',
      component: Result
    }
  ]
})

export default router
