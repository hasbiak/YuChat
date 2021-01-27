import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './modules/auth'
import User from './modules/user'
import Friend from './modules/friend'
import Room from './modules/room'
import Message from './modules/message'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Auth,
    User,
    Friend,
    Room,
    Message
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  plugins: [
    createPersistedState({
      paths: ['Auth.user'],
      storage: window.sessionStorage
    })
  ]
})
