<template>
  <!-- INVITE FRIEND -->
  <b-modal id="invite-friend" hide-footer centered>
    <template v-slot:modal-title> Find Users YuChat </template>
    <b-row>
      <b-col cols="12">
        <b-form-input
          type="search"
          v-model="search"
          placeholder="Search User By Email"
          v-on:keyup.enter="onSearch"
        ></b-form-input>
      </b-col>
      <b-col cols="12" v-if="notFound">
        <p style="color: red; font-size: 14px" class="mt-2">
          Email not found<br />
        </p>
      </b-col>
    </b-row>
    <div v-if="found" class="mt-3">
      <b-row>
        <b-col cols="2" class="align-self-center text-center">
          <b-avatar
            :src="url + '/' + searchData.user_image"
            class="no-image"
          ></b-avatar>
        </b-col>
        <b-col cols="6" class="align-self-center">
          <p class="mb-0">{{ searchData.user_name }}</p>
          <small class="mb-0">{{ searchData.user_email }}</small>
        </b-col>
        <b-col cols="4" class="align-self-center">
          <b-button v-if="notInvited" class="" @click="onAdd()"
            >Add to friendlist</b-button
          >
          <b-button v-if="isInvited" class="btn-success" disabled>
            Friend Added
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ModalInviteFriend',
  data() {
    return {
      search: '',
      notFound: false,
      found: false,
      isInvited: null,
      notInvited: null,
      url: process.env.VUE_APP_BASE_URL
    }
  },
  computed: {
    ...mapGetters({
      searchData: 'getSearch',
      friend: 'getFriendlist',
      user: 'getUser'
    })
  },
  methods: {
    ...mapActions(['getUserByEmail', 'addFriend', 'getFriendById']),
    onSearch() {
      this.notFound = false
      this.found = false
      this.getUserByEmail(this.search)
        .then((response) => {
          if (response.data.length === 0) {
            this.notFound = true
            this.found = false
          } else {
            this.found = true
            this.notFound = false
            const check = this.friend.some(
              (el) => el.user_id === this.searchData.user_id
            )
            if (this.user.user_id === this.searchData.user_id) {
              this.notInvited = false
              this.isInvited = false
            } else if (check) {
              this.isInvited = true
              this.notInvited = false
            } else if (!check) {
              this.notInvited = true
              this.isInvited = false
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onAdd() {
      const payload = {
        user_id: this.user.user_id,
        friend_id: this.searchData.user_id
      }
      this.addFriend(payload).then((response) => {
        const payloadContact = {
          user_id: this.user.user_id,
          search: ''
        }
        this.getFriendById(payloadContact)
        this.makeToast('success', 'Success', response.message)
        this.isInvited = true
        this.notInvited = false
      })
    },
    makeToast(variant, title, msg) {
      this.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true
      })
    }
  }
}
</script>

<style src="@/assets/css/style.css"></style>
