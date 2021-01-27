<template>
  <div>
    <div class="chat-list">
      <div v-if="rooms.length > 0">
        <div
          v-for="(value, index) in rooms"
          :key="index"
          @click="onSelect(value)"
        >
          <div class="contact-item">
            <div class="contact-image">
              <b-avatar
                :src="url + '/' + value.user_image"
                class="no-image"
              ></b-avatar>
            </div>

            <div class="name-description cursor-pointer">
              <h5 class="mb-0 font-17">
                {{ value.user_name }}
              </h5>
              <!-- <p class="mb-0 font-13 text-muted">This is message...</p> -->
              <p
                class="read mb-0 font-13 text-muted"
                v-if="value.recent && value.recent.user_id === user.user_id"
              >
                Me: {{ value.recent.message.slice(0, 25) }}...
              </p>
              <p
                class="read mb-0 font-13 text-muted"
                v-else-if="
                  value.recent && value.recent.user_id !== user.user_id
                "
              >
                {{ value.recent.message.slice(0, 25) }}...
              </p>
            </div>

            <div class="clock-check text-right ml-auto">
              <p class="mb-0 font-15 clock" v-if="value.recent">
                <small class="clock text-dark d-inline-block mt-1">{{
                  filterTime(value.recent.message_created_at)
                }}</small>
                <!-- {{ value.recent.message_created_at.slice(0, 16) }} -->
              </p>
              <span class="cursor-pointer text-muted">
                <b-icon icon="bell-fill"></b-icon>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h5 class="text-dark mb-5 text-center">There are no chatting rooms</h5>
        <g-image
          url="illustration/noprivate.svg"
          class="img-fluid px-1"
          alt="private"
        />
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      url: process.env.VUE_APP_BASE_URL,
      socket: io(process.env.VUE_APP_BASE_URL),
      search: '',
      prevRoom: ''
    }
  },
  components: {},
  mounted() {
    this.socket.on('chatMsg', (data) => {
      this.pushMessage(data)
      this.getRoomByUserId(this.user.user_id)
    })
  },
  created() {
    this.getRoomByUserId(this.user.user_id)
  },
  computed: {
    ...mapGetters({ rooms: 'getRoom', user: 'getUser' })
  },
  methods: {
    ...mapActions(['getMessageByRoomId', 'getRoomByUserId', 'logout']),
    ...mapMutations(['setSelect', 'setSelectedRoom', 'pushMessage']),
    onSelect(data) {
      this.getRoomByUserId(this.user.user_id)
      this.setSelectedRoom(data)
      const payload = {
        room_id: data.room_id,
        user_id: this.user.user_id
      }
      this.setSelect(true)
      this.getMessageByRoomId(payload)
      if (!this.prevRoom) {
        this.socket.emit('joinRoom', data.room_id)
        this.prevRoom = data.room_id
      } else {
        this.socket.emit('changeRoom', {
          prevRoom: this.prevRoom,
          newRoom: data.room_id
        })
        this.prevRoom = data.room_id
      }
    },
    filterTime(val) {
      const date = new Date(val)
      const minute = date.getMinutes()
      const hours = date.getHours()
      const result = `${hours < 10 ? '0' + hours : hours}:${
        minute < 10 ? '0' + minute : minute
      }`
      return result
    }
  }
}
</script>

<style scoped></style>
