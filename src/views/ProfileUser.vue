<template>
  <div class="background">
    <b-container class="py-5">
      <b-row class="justify-content-center">
        <b-col xl="6" cols="9" class="item text-center py-4 px-5">
          <h3 class="bluetext my-3">My Profile</h3>
          <b-alert
            show
            variant="warning"
            v-if="user.user_phone === null || user.user_about === null"
            v-show="isShow"
          >
            Complete your Profile please.
          </b-alert>
          <b-avatar
            size="10rem"
            class="mt-3"
            :src="url + '/fileuploadsyuchat/' + user.user_image"
          >
          </b-avatar>
          <div class="edit-image mt-2 mb-4 text-muted">
            <b-icon icon="pencil" scale="0.9"></b-icon>
            <label for="files" class="mb-0 edit-image"> Select Image</label>
            <input
              id="files"
              type="file"
              ref="file"
              @change.prevent="upFile"
              style="display: none"
            />
          </div>

          <b-row class="my-4">
            <b-col cols="2" class="align-self-center text-center px-0">
              <b-icon icon="person" font-scale="1.5"></b-icon>
            </b-col>
            <b-col cols="10" class="text-left">
              <p class="my-0 font-weight-bold">Name</p>
              <p class="my-0 text-uppercase">
                {{ user.user_name }}
              </p>
            </b-col>
            <b-col cols="12"><hr /></b-col>
            <b-col cols="2" class="align-self-center text-center px-0">
              <b-icon icon="exclamation-circle" font-scale="1.5"></b-icon>
            </b-col>
            <b-col cols="10" class="text-left">
              <p class="my-0 font-weight-bold">About</p>
              <small
                class="my-0"
                v-if="user.user_about === '' || user.user_about === null"
              >
                set your id
              </small>
              <p class="my-0" v-else>{{ user.user_about }}</p>
            </b-col>
            <b-col cols="12"><hr /></b-col>
            <b-col cols="2" class="align-self-center text-center px-0">
              <b-icon icon="phone" font-scale="1.5"></b-icon>
            </b-col>
            <b-col cols="10" class="text-left">
              <p class="my-0 font-weight-bold">Phone</p>
              <small
                class="my-0"
                v-if="user.user_phone === '' || user.user_phone === null"
              >
                set your phone number
              </small>
              <p class="my-0" v-else>{{ user.user_phone }}</p>
            </b-col>
          </b-row>

          <b-button size="sm" class="mb-2" @click="modalEdit">
            <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
            Edit Profile
          </b-button>
          <hr />
          <b-button
            style="border: 1px solid #7e98df; background-color: #7e98df"
            class="my-4 px-5 rounded-pill"
            @click="toHome"
          >
            Home
          </b-button>
        </b-col>
      </b-row>
    </b-container>

    <b-modal id="edit-profile" hide-footer centered>
      <template v-slot:modal-title> Edit Profile</template>
      <b-form @submit.prevent="updateProfile()">
        <b-form-group label-cols-sm="3" label="Name" label-for="nested-name">
          <b-form-input
            id="nested-name"
            v-model="form.user_name"
          ></b-form-input>
        </b-form-group>
        <b-form-group label-cols-sm="3" label="About" label-for="nested-about">
          <b-form-input
            id="nested-about"
            v-model="form.user_about"
          ></b-form-input>
        </b-form-group>
        <b-form-group label-cols-sm="3" label="Phone" label-for="nested-phone">
          <b-form-input
            id="nested-phone"
            v-model="form.user_phone"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" class="btn btn-success"> Save </b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ProfileUser',
  data() {
    return {
      url: process.env.VUE_APP_BASE_URL,
      form: {
        user_name: '',
        user_about: '',
        user_phone: ''
      },
      formImage: {},
      isShow: true
    }
  },
  created() {
    this.getUserById(this.user.user_id)
  },
  computed: {
    ...mapGetters({ user: 'getUser' })
  },
  methods: {
    ...mapActions(['getUserById', 'patchImageUser', 'patchUser']),
    modalEdit() {
      this.form = {
        user_name: this.user.user_name,
        user_phone: this.user.user_phone,
        user_about: this.user.user_about
      }
      this.$bvModal.show('edit-profile')
    },
    updateProfile() {
      const payload = {
        id: this.user.user_id,
        form: this.form
      }
      this.patchUser(payload)
        .then((response) => {
          this.getUserById(this.user.user_id)
          this.makeToast('success', 'Success', response.message)
          this.$bvModal.hide('edit-profile')
        })
        .catch((error) => {
          this.makeToast('danger', 'Error', error.data.message)
        })
    },
    upFile(event) {
      this.formImage.user_image = event.target.files[0]
      const data = new FormData()
      data.append('user_image', this.formImage.user_image)
      const payload = {
        id: this.user.user_id,
        form: data
      }
      this.patchImageUser(payload)
        .then((response) => {
          console.log(response)
          this.formImage = {}
          this.getUserById(this.user.user_id)
          this.makeToast('success', 'Success', 'Image Updated')
        })
        .catch((error) => {
          this.makeToast('danger', 'Error', error.data.message)
        })
    },
    save() {
      this.getUserById(this.user.user_id)
      this.makeToast('success', 'Success', 'Image Updated')
    },
    toHome() {
      if (
        this.user.user_about === null ||
        this.user.user_about === '' ||
        this.user.user_phone === null ||
        this.user.user_about === ''
      ) {
        this.makeToast('danger', 'Error', 'You must complete data profile')
      } else {
        this.$router.push('/home')
      }
    },
    makeToast(variant, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        solid: true
      })
    }
  }
}
</script>

<style src="@/assets/css/style.css"></style>
