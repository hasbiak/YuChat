<template>
  <b-col lg="8" md="7" class="bg-light p-0 right-chat max-vh-100 min-vh-100">
    <!-- HEADER ROOMCHAT -->
    <div class="card border-0 rounded-0">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div class="d-flex">
          <button type="button" @click="clearChat" class="btn">
            <g-image class="back-icon" url="icon/back.svg" />
          </button>
          <b-avatar
            :src="url + '/' + room.user_image"
            class="no-image mr-2"
          ></b-avatar>
          <div class="d-flex flex-column justify-content-around">
            <p class="mb-0">
              <strong>{{ room.user_name }}</strong>
            </p>
            <small class="mb-0" v-if="room.user_activity === 0">Offline</small>
            <small class="mb-0" v-if="room.user_activity === 1">Online</small>
          </div>
        </div>
        <button class="btn" v-b-toggle.info-friend @click="onDetail()">
          <g-image url="icon/profile_menu.svg" class="img-fluid" />
        </button>
      </div>
    </div>

    <!-- CHATROOM -->
    <div id="chat-c">
      <b-container fluid v-for="(item, index) in chat" :key="index">
        <b-row v-if="item.class === 'sender'" align-h="start">
          <div class="sender">
            <span class="text-light mb-1 d-inline-block font-16">{{
              item.message
            }}</span>
            <div class="clearfix"></div>
            <div v-if="item.class === 'sender'">
              <timeago
                :datetime="item.message_created_at"
                class="font-12 text-light"
                :auto-update="60"
              ></timeago>
              <small class="clock text-light d-inline-block mt-1">{{
                filterTime(item.message_created_at)
              }}</small>
            </div>
          </div>
        </b-row>

        <b-row v-if="item.class === 'receiver'" align-h="end">
          <div class="receiver">
            <span class="text-dark mb-1 d-inline-block font-16">{{
              item.message
            }}</span>
            <div class="clearfix"></div>

            <div v-if="item.class === 'receiver'">
              <timeago
                :datetime="item.message_created_at"
                class="font-12 text-secondary"
                :auto-update="60"
              ></timeago>
              <small class="clock text-secondary d-inline-block mt-1">{{
                filterTime(item.message_created_at)
              }}</small>
            </div>
          </div>
        </b-row>
      </b-container>
    </div>

    <!-- SEND CHAT -->
    <div class="card border-0 rounded-0 chat-input-card">
      <div class="card-body position-relative">
        <input
          v-on:keyup.enter="onSend"
          v-model="message"
          type="text"
          placeholder="Type your message..."
          class="form-control input-chat font-14"
        />
        <div @click="onSend">
          <g-image
            url="icon/send.svg"
            class="icon-send position-absolute cursor-pointer"
          />
        </div>
      </div>
    </div>
  </b-col>
</template>

<script>
// import moment from 'moment'
import io from 'socket.io-client'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ChatRoom',
  data() {
    return {
      url: process.env.VUE_APP_BASE_URL,
      message: null,
      socket: io(process.env.VUE_APP_BASE_URL)
    }
  },
  mounted() {
    this.scrollToEnd()
  },
  created() {
    this.getRoomByUserId(this.user.user_id)
  },
  computed: {
    ...mapGetters({
      room: 'getSelectedRoom',
      chat: 'getMessage',
      user: 'getUser',
      friend: 'getFriendlist'
    })
  },
  methods: {
    ...mapActions([
      'getMessageByRoomId',
      'sendMessage',
      'getRoomByUserId',
      'logout'
    ]),
    ...mapMutations(['setSelect', 'setFriendProfile']),
    scrollToEnd() {
      const container = this.$el.querySelector('#chat-c')
      container.scrollTop = container.scrollHeight
    },
    onSend() {
      const payload = {
        room_id: this.room.room_id,
        user_id: this.user.user_id,
        message: this.message
      }
      this.sendMessage(payload)
      const payloadRoom = {
        room_id: this.room.room_id,
        user_id: this.user.user_id
      }
      this.getMessageByRoomId(payloadRoom).then((Response) => {
        this.scrollToEnd()
        this.getRoomByUserId(this.user.user_id)
      })
      const addData = {
        message: this.message,
        class: 'sender',
        message_created_at: new Date(),
        room: this.room.room_id,
        user: this.room.user_id,
        name: this.user.user_name
      }
      this.socket.emit('roomMsg', addData)
      this.message = ''
    },
    onDetail() {
      this.setFriendProfile(
        this.friend.filter((value) => value.user_id === this.room.user_id)[0]
      )
    },
    clearChat() {
      this.setSelect(false)
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

<style src="@/assets/css/style.css"></style>
