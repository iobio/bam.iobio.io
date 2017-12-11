import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery

import d3 from 'd3'
import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Home from './components/pages/Home.vue'
import BamVue from './components/pages/BamView.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/bamview/:selectedFileURL',
    name: 'BamView',
    component: BamVue,
    props: true
  }
]

const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
