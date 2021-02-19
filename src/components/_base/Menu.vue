<template>
  <div>
    <div
      class="sidebar-title mt-4 mb-4 d-flex justify-content-between align-items-center"
    >
      <h5 class="mb-0 color-lb">Yu Chat</h5>
      <div class="btn-group">
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
        >
          <template #button-content>
            <g-image url="icon/menu.svg" class="mr-0 cursor-pointer" />
          </template>

          <b-dropdown-item v-b-toggle.sidebar-profile class="mb-0 pb-0">
            <button
              class="dropdown-item d-flex justify-content-between px-0"
              type="button"
            >
              <span>Setting</span>
              <g-image class="ml-5" url="icon/setting.svg" /></button
          ></b-dropdown-item>
          <b-dropdown-item class="mb-0 pb-0"
            ><router-link
              :to="{ name: 'Friends' }"
              class="dropdown-item d-flex justify-content-between px-0"
              type="button"
            >
              <span>Contacts</span>
              <g-image class="ml-5" url="icon/contact.svg" /> </router-link
          ></b-dropdown-item>
          <b-dropdown-item class="mb-0 pb-0"
            ><router-link
              :to="{ name: '' }"
              @click.native="$bvModal.show('invite-friend')"
              class="dropdown-item d-flex justify-content-between px-0"
              type="button"
            >
              <span>Invite Friends</span>
              <g-image class="ml-5" url="icon/invite.svg" /> </router-link
          ></b-dropdown-item>
          <b-dropdown-item class="mb-0 pb-0"
            ><router-link
              :to="{ name: '' }"
              class="dropdown-item d-flex justify-content-between px-0"
              type="button"
            >
              <span>Faq Yu Chat</span>
              <g-image class="ml-5" url="icon/FAQ.svg" /> </router-link
          ></b-dropdown-item>

          <b-dropdown-item class="mb-0 pb-0">
            <button
              @click="toLogout"
              class="dropdown-item d-flex justify-content-between px-0"
              type="button"
            >
              <span>Logout</span>
              <g-image class="ml-5" url="icon/back.svg" />
            </button>
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <ModalInvite />
      <SideProfile />
      <InfoFriend />
    </div>

    <div class="sticky-top bg-white pt-2 pb-2">
      <!-- SEARCH CHAT AND FRIENDLIST -->
      <div class="sidebar-search mb-4">
        <div class="input-group mb-3">
          <g-image url="icon/search.svg" width="20" class="search-icon" />
          <input
            type="text"
            class="form-control font-15 rounded-pill border-0 bg-light"
            placeholder="Search chat"
            v-model="search"
            @keyup="searchHandle"
          />
          <div class="input-group-append">
            <button
              class="btn no-focus"
              type="button"
              @click="$bvModal.show('friend-list')"
            >
              <g-image url="icon/plus.svg" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SEARCH FRIENDLIST AND FRIENDLIST -->
    <b-modal id="friend-list" hide-footer centered>
      <template v-slot:modal-title> Friend List</template>
      <b-row>
        <b-col cols="12">
          <b-form-input
            type="search"
            v-model="search"
            placeholder="Search Friend Name"
            v-on:keyup.enter="onSearch"
          ></b-form-input>
        </b-col>
      </b-row>
      <div v-if="friendlist.length === 0" class="mt-2">
        <div><small>Friend not Found</small></div>
      </div>

      <div
        v-else-if="friendlist.length > 0"
        v-for="(item, index) in friendlist"
        :key="index"
        class="my-2"
      >
        <div class="contact-item my-4">
          <div class="contact-image mr-3">
            <b-avatar
              :src="url + '/fileuploadsyuchat/' + item.user_image"
              class="no-image"
            ></b-avatar>
          </div>

          <div class="name-description">
            <h5 class="mb-0 font-17" align-self="center">
              {{ item.user_name }}
            </h5>
            <p
              class="mb-0 font-13 text-info see-profile"
              @click="onFriend(item)"
              v-b-toggle.info-friend
            >
              Lihat Profile
            </p>
          </div>

          <div class="align-self-center ml-auto">
            <b-icon
              @click="onChat(item)"
              icon="chat-text"
              font-scale="1.3"
              class="mx-3 cursor-pointer icon-text"
            ></b-icon>
            <b-icon
              @click="onDelete(item)"
              icon="trash"
              font-scale="1.3"
              class="mx-3 cursor-pointer icon-trash"
            ></b-icon>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ModalInvite from '../_base/ModalInvite'
import SideProfile from '../_base/SideProfile'
import InfoFriend from '../_base/InfoFriend'
import io from 'socket.io-client'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Menu',
  components: {
    ModalInvite,
    SideProfile,
    InfoFriend
  },
  data() {
    return {
      url: process.env.VUE_APP_BASE_URL,
      search: '',
      isDelete: false,
      isLogout: false,
      socket: io.connect(process.env.VUE_APP_BASE_SOCKET, {
        path: '/yuchat/socket.io'
      }),
      menus: [
        {
          name: 'All',
          status: false
        },
        {
          name: 'Private',
          status: false
        },
        {
          name: 'Friends',
          status: false
        }
      ]
    }
  },
  created() {
    this.getUserById(this.user.user_id)
    const payloadFriend = {
      user_id: this.user.user_id,
      search: this.search
    }
    this.getFriendById(payloadFriend)
    this.getRoomByUserId(this.user.user_id)
  },
  mounted() {
    this.socket.on('chatMsg', (data) => {
      this.pushMessage(data)
      this.getRoomByUserId(this.user.user_id)
    })
    this.socket.on('notify', (data) => {
      if (data.user === this.user.user_id) {
        this.makeToast('info', data.name, data.message)
      }
    })
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      friendlist: 'getFriendlist',
      rooms: 'getRoom',
      chat: 'getMessage'
    }),
    currentRouteName() {
      return this.$route.name
    }
  },
  methods: {
    ...mapActions([
      'getUserById',
      'getFriendById',
      'deleteFriend',
      'createRoom',
      'getRoomByUserId',
      'getMessageByRoomId',
      'logout',
      'patchActivity'
    ]),
    ...mapMutations([
      'setFriendProfile',
      'setSelect',
      'setSelectedRoom',
      'pushMessage'
    ]),
    onSearch() {
      const payload = {
        user_id: this.user.user_id,
        search: this.search
      }
      this.getFriendById(payload)
    },
    onDelete(data) {
      this.$bvModal
        .msgBoxConfirm(`Delete ${data.user_name} from friendlist ?`, {
          cancelVariant: 'info',
          okVariant: 'danger',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
        .then((value) => {
          this.isDelete = value
          if (this.isDelete === true) {
            const payload = {
              user_id: this.user.user_id,
              friend_id: data.user_id
            }
            this.deleteFriend(payload).then((res) => {
              const payloadFriend = {
                user_id: this.user.user_id,
                search: this.search
              }
              this.getFriendById(payloadFriend)
              this.makeToast('success', 'Success', res.message)
            })
          }
        })
    },
    onFriend(data) {
      this.setFriendProfile(data)
      this.$bvModal.hide('friend-list')
    },
    onChat(data) {
      const check = this.rooms.some((value) => {
        return value.user_id === data.user_id
      })
      if (check) {
        this.makeToast('info', 'Info', 'Room is already exists')
      } else {
        const payload = {
          user_id: this.user.user_id,
          friend_id: data.user_id
        }
        this.createRoom(payload).then((res) => {
          this.makeToast('success', 'Success', res.message)
          this.getRoomByUserId(this.user.user_id)
          this.$bvModal.hide('friend-list')
        })
      }
    },
    makeToast(variant, title, msg) {
      this.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true
      })
    },
    searchHandle() {
      console.log('ok')
    },
    toLogout() {
      this.$bvModal
        .msgBoxConfirm('Are you sure want to logout?', {
          cancelVariant: 'danger',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
        .then((value) => {
          this.isLogout = value
          if (this.isLogout) {
            const patchActive = {
              id: this.user.user_id,
              form: {
                user_activity: 0,
                user_updated_at: new Date()
              }
            }
            this.patchActivity(patchActive).then((response) =>
              this.getRoomByUserId(this.user.user_id)
            )
            this.logout(this.user.user_id)
          }
        })
    }
  }
}
</script>

<style src="@/assets/css/style.css"></style>
