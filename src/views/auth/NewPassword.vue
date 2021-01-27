<template>
  <div class="background">
    <b-container class="py-5">
      <b-row class="justify-content-center">
        <b-col xl="5" cols="9" class="item py-4 px-5" style="height: 550px">
          <h4 class="bluetext text-center my-3" v-show="!isSuccess">
            New Password
          </h4>
          <h4 class="bluetext text-center my-3" v-show="isSuccess">
            Success Reset Password
          </h4>

          <p class="my-4" v-show="!isSuccess">Input your New Password</p>
          <b-alert
            show
            variant="danger"
            v-show="isError"
            class="my-2 text-center"
            >{{ error }}</b-alert
          >
          <b-alert show variant="success" v-show="isSuccess">
            Click
            <router-link to="/login">here</router-link>
            to login with new Password</b-alert
          >
          <b-form @submit.prevent="onSubmit" v-show="!isSuccess">
            <div class="my-5">
              <p class="my-1 text-secondary">New Password</p>
              <input
                class="inputset"
                required
                type="password"
                v-model="form.user_password"
              />
            </div>
            <div class="my-5">
              <p class="my-1 text-secondary">Confirm New Password</p>
              <input
                class="inputset"
                required
                type="password"
                v-model="form.confirm_password"
              />
            </div>
            <b-button type="submit" class="blue btn-block my-4 rounded-pill"
              >Reset Password</b-button
            >
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'NewPassword',
  data() {
    return {
      form: {
        user_password: '',
        confirm_password: ''
      },
      isError: false,
      isSuccess: false,
      error: ''
    }
  },
  methods: {
    ...mapActions(['changePassword']),
    onSubmit() {
      const payload = {
        keys: this.$route.query.keys,
        form: this.form
      }
      this.changePassword(payload)
        .then((result) => {
          this.isError = false
          this.isSuccess = true
        })
        .catch((error) => {
          this.isError = true
          this.error = error.data.message
        })
    }
  }
}
</script>

<style src="@/assets/css/style.css"></style>
