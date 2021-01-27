import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from './store/index'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueGeolocation from 'vue-browser-geolocation'
import { ValidationProvider, extend, configure } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import './assets/css/style.css'
import './GComponents.js'
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'
import VueTimeago from 'vue-timeago'

Vue.prototype.moment = moment
Vue.use(require('vue-moment'))
Vue.use(InfiniteLoading)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBZpPq3vplUkanxJIYF0vScyWeW6l7CzRk',
    libraries: 'places'
  }
})
Vue.use(VueGeolocation)
Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en'
})

// VEE-VALIDATE
extend('required', {
  ...required,
  message: 'This field is required'
})
extend('email', {
  ...email,
  message: 'This field must be a valid email'
})
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
})
Vue.component('ValidationProvider', ValidationProvider)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
