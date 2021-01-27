import axios from 'axios'
// import moment from 'moment'

export default {
  state: {
    message: {}
  },
  mutations: {
    setMessage(state, payload) {
      state.message = payload
    },
    pushMessage(state, payload) {
      state.message.push(payload)
    }
  },
  actions: {
    getMessageByRoomId(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${process.env.VUE_APP_BASE_URL}/message?room_id=${payload.room_id}&user_id=${payload.user_id}`
          )
          .then(response => {
            // for (let i = 0; i < response.data.data.length; i++) {
            //   response.data.data[i].message_created_at = moment(
            //     response.data.data[i].message_created_at
            //   ).format('MMMM Do YYYY, h:mm a')
            // }
            context.commit('setMessage', response.data.data)
            resolve(response.data)
          })
          .catch(error => reject(error.response))
      })
    },
    sendMessage(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_BASE_URL}/message/send`, payload)
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
    }
  },
  getters: {
    getMessage(state) {
      return state.message
    }
  }
}
