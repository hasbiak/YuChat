import axios from 'axios'

export default {
  state: {
    search: {}
  },
  mutations: {
    setSearch(state, payload) {
      state.search = payload
    }
  },
  actions: {
    patchImageUser(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(
            `${process.env.VUE_APP_BASE_URL}/user/image/${payload.id}`,
            payload.form
          )
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
    },
    patchUser(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(
            `${process.env.VUE_APP_BASE_URL}/user/profile/${payload.id}`,
            payload.form
          )
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
    },
    patchMaps(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(
            `${process.env.VUE_APP_BASE_URL}/user/maps/${payload.id}`,
            payload.form
          )
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
    },
    getUserByEmail(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_BASE_URL}/user/search/${payload}`)
          .then(response => {
            context.commit('setSearch', response.data.data[0])
            resolve(response.data)
          })
          .catch(error => reject(error.response))
      })
    },
    patchActivity(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(
            `${process.env.VUE_APP_BASE_URL}/user/activity/${payload.id}`,
            payload.form
          )
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
    }
  },
  getters: {
    getSearch(state) {
      return state.search
    }
  }
}
