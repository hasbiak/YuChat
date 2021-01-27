<template>
  <div class="background">
    <b-container class="py-5">
      <b-row class="justify-content-center">
        <b-col xl="5" cols="9" class="item py-4 px-5">
          <b-row>
            <b-col class="1 align-self-center">
              <routerLink class="toLogin" to="/login">&lt;</routerLink>
            </b-col>
            <b-col class="10">
              <h4 class="bluetext text-center my-3" v-show="!isSuccess">
                Register
              </h4>
              <h4 class="bluetext text-center my-3" v-show="isSuccess">
                Register Success !
              </h4>
            </b-col>
            <b-col class="1"></b-col>
          </b-row>

          <p class="my-4" v-show="!isSuccess">Let's Create Your Account</p>
          <b-alert show variant="danger" v-show="isError" class="text-center">
            {{ error }}
          </b-alert>
          <b-alert show variant="success" v-show="isSuccess">
            Check Your Email for Activation Account.
          </b-alert>
          <b-form @submit.prevent="onSubmit" v-show="!isSuccess">
            <div class="my-5">
              <p class="my-1 text-secondary">Name</p>
              <input
                class="inputset"
                required
                type="text"
                v-model="form.user_name"
              />
            </div>
            <div class="my-5">
              <p class="my-1 text-secondary">Email</p>
              <input
                class="inputset"
                required
                type="email"
                v-model="form.user_email"
              />
            </div>
            <div class>
              <p class="my-1 text-secondary">Password</p>
              <input
                class="inputset mb-4"
                required
                type="password"
                v-model="form.user_password"
              />
            </div>
            <b-button type="submit" class="blue btn-block my-4 rounded-pill"
              >Register</b-button
            >
          </b-form>
          <div class="text-center">
            <small>Register With</small>
          </div>
          <b-button
            type="button"
            class="btn-block my-4 rounded-pill bg-white"
            style="border: 1px solid #7e98df; color: #7e98df"
            >Google</b-button
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        user_name: '',
        user_email: '',
        user_password: ''
      },
      isSuccess: false,
      isError: false,
      error: ''
    }
  },
  created() {},
  methods: {
    ...mapActions(['register', 'sendEmailActivation']),
    onSubmit() {
      this.register(this.form)
        .then((result) => {
          const activation = {
            user_email: this.form.user_email
          }
          this.sendEmailActivation(activation)
            .then((result) => {
              this.isError = false
              this.isSuccess = true
            })
            .catch((error) => {
              this.isError = true
              this.error = error.data.message
            })
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
