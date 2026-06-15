import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery

import d3 from 'd3'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAnalytics from 'vue-analytics'

import App from './App.vue'
import BamView from './components/pages/BamView.vue'
import Help from './components/pages/Help.vue'
import FileRequirements from './components/pages/FileRequirements.vue'
import Home from './components/pages/Home.vue'
import License from './components/pages/License.vue'

import VTooltip from 'v-tooltip'
import               '../assets/css/v-tooltip.css'
import { loadAppConfig } from '../js/appConfig'
Vue.use(VTooltip)

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/help',
    name: 'help',
    component: Help,
  },
  {
    path: '/file-requirements',
    name: 'file-requirements',
    component: FileRequirements,
  },
  {
    path: '/license',
    name: 'license',
    component: License
  }
]

loadAppConfig()
.then(appConfig => {
  appConfig.bam.path = appConfig.bam.path.replace(/\/?$/, '/');

  const router = new VueRouter({
    mode: 'history',
    base: appConfig.bam.path,
    routes: routes
  })

  Vue.prototype.$appConfig = appConfig;

  // Google analytics
  Vue.use(VueAnalytics, {
    id: 'UA-47481907-2',
    router
  })

  new Vue({
    el: '#app',
    render: h => h(App),
    router
  })
})
.catch(error => {
  console.error(error);
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.innerHTML = '<div style="margin: 40px; font-family: sans-serif; color: #900;">Unable to load bam.iobio configuration.</div>';
  }
});
