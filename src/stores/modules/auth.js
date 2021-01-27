import axios from 'axios'
import router from '../../router/index'

export default {
  state: {
    isLoading: false,
    user: {},
    token: localStorage.getItem('token') || null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      state.token = payload.token
    },
    setUserLogin(state, payload) {
      state.user = payload
    },
    delUser(state, payload) {
      state.user = {}
      state.token = null
    }
  },
  actions: {
    getUserById(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_BASE_URL}/user/id/${payload}`)
          .then((response) => {
            context.commit('setUserLogin', response.data.data[0])
            resolve(response.data)
          })
          .catch((error) => reject(error.response))
      })
    },
    register(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_BASE_URL}/user/register`, payload)
          .then((response) => resolve(response.data))
          .catch((error) => reject(error.response))
      })
    },
    sendEmailActivation(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${process.env.VUE_APP_BASE_URL}/user/send-email-activation`,
            payload
          )
          .then((response) => resolve(response.data))
          .catch((error) => {
            console.log(error)
            reject(error.response)
          })
      })
    },
    activationAccount(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(
            `${process.env.VUE_APP_BASE_URL}/user/activation-account?keys=${payload}`
          )
          .then((response) => resolve(response.data))
          .catch((error) => {
            console.log(error)
            reject(error.response)
          })
      })
    },
    login(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_BASE_URL}/user/login`, payload)
          .then((response) => {
            delete response.data.data.user_password
            context.commit('setUser', response.data.data)
            localStorage.setItem('token', response.data.data.token)
            resolve(response.data)
          })
          .catch((error) => {
            reject(error.response)
          })
      })
    },
    sendEmailPassword(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_BASE_URL}/user/forgot-password`, payload)
          .then((response) => resolve(response.data))
          .catch((error) => {
            console.log(error)
            reject(error.response)
          })
      })
    },
    changePassword(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(
            `${process.env.VUE_APP_BASE_URL}/user/change-password?keys=${payload.keys}`,
            payload.form
          )
          .then((response) => resolve(response.data))
          .catch((error) => {
            console.log(error)
            reject(error.response)
          })
      })
    },
    logout(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`${process.env.VUE_APP_BASE_URL}/user/logout/${payload}`)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error.response)
          })
        localStorage.removeItem('token')
        sessionStorage.clear()
        context.commit('delUser')
        router.push('/login')
      })
    },
    interceptorRequest(context) {
      axios.interceptors.request.use(
        function (config) {
          config.headers.Authorization = `Bearer ${context.state.token}`
          return config
        },
        function (error) {
          return Promise.reject(error)
        }
      )
    },
    interceptorResponse(context) {
      axios.interceptors.response.use(
        function (response) {
          return response
        },
        function (error) {
          if (error.response.status === 403) {
            if (
              error.response.data.message === 'invalid token' ||
              error.response.data.message === 'invalid signature'
            ) {
              localStorage.removeItem('token')
              context.commit('delUser')
              router.push('/')
              alert(error.response.data.message)
            } else if (error.response.data.message === 'jwt expired') {
              localStorage.removeItem('token')
              context.commit('delUser')
              router.push('/')
              alert(error.response.data.message)
            }
          }
          return Promise.reject(error)
        }
      )
    }
  },
  getters: {
    isLogin(state) {
      return state.token !== null // true
    },
    getUser(state) {
      return state.user
    },
    getLoading(state) {
      return state.isLoading
    }
  }
}
