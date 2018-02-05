import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery

import d3 from 'd3'
import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import BamVue from './components/pages/BamView.vue'
import Help from './components/pages/Help.vue'
import Home from './components/pages/Home.vue'
import License from './components/pages/License.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/bamview',
    name: 'bam-view',
    component: BamVue,
    props: (route) => ({
      selectedBamURL: route.query.bamURL,
      selectedBaiURL: route.query.baiURL,
      regionURLParam: route.query.region,
      sampling: route.query.sampling,
      // Parameters for when triggered from Illumina
      action: route.query.action,
      appSessionHref: route.query.appsessionuri,
      authorization_code: route.query.authorization_code,
    })
  },
  {
    // File objects not working sending in as query params like above, so use properties instead.
    path: '/bamview?bamFile=:selectedBamFile?&baiFile=:selectedBaiFile?',
    name: 'bam-view-file',
    component: BamVue,
    props: true
  },
  {
    path: '/help',
    name: 'help',
    component: Help
  },
  {
    path: '/license',
    name: 'license',
    component: License
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
