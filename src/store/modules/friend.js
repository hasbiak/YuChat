import axios from 'axios'

export default {
  state: {
    friend: {},
    friendProfile: {}
  },
  mutations: {
    setFriend(state, payload) {
      state.friend = payload
    },
    setFriendProfile(state, payload) {
      state.friendProfile = payload
    }
  },
  actions: {
    getFriendById(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${process.env.VUE_APP_BASE_URL}/friend/id/${payload.user_id}?search=${payload.search}`
          )
          .then(response => {
            context.commit('setFriend', response.data.data)
            resolve(response.data)
          })
          .catch(error => reject(error.response))
      })
    },
    addFriend(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_BASE_URL}/friend/add`, payload)
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
    },
    deleteFriend(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .delete(
            `${process.env.VUE_APP_BASE_URL}/friend/delete?user_id=${payload.user_id}&friend_id=${payload.friend_id}`
          )
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
    }
  },
  getters: {
    getFriendlist(state) {
      return state.friend
    },
    getFriendProfile(state) {
      return state.friendProfile
    }
  }
}
