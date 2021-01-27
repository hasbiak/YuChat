<template>
  <CardAuth
    title="Forgot Password"
    needBack
    description="You’ll get messages soon on your e-mail "
  >
    <template #body>
      <form @submit.prevent="onSubmit">
        <div class="form-group-auth">
          <label>Email</label>
          <input
            type="email"
            name="email"
            v-model="form.user_email"
            class="form-control"
          />
        </div>
        <g-button
          :isLoading="getLoading"
          type="submit"
          class="btn btn-lb btn-block mt-4 p-auth rounded-pill"
          >Send</g-button
        >
      </form>
    </template>
  </CardAuth>
  <!-- <div class="background">
    <b-container class="py-5">
      <b-row class="justify-content-center">
        <b-col xl="5" cols="9" class="item py-4 px-5" style="height: 550px">
          <b-row>
            <b-col cols="1" class="align-self-center">
              <routerLink class="toLogin" to="/login">&lt;</routerLink>
            </b-col>
            <b-col cols="10">
              <h4 class="bluetext text-center my-3">Forgot Password</h4>
            </b-col>
            <b-col cols="1"></b-col>
          </b-row>

          <p class="my-4" v-show="!isSuccess">
            You'll get messages soon on your e-mail
          </p>
          <b-alert
            show
            variant="danger"
            v-show="isError"
            class="my-2 text-center"
            >{{ error }}</b-alert
          >
          <b-alert show variant="success" v-show="isSuccess"
            >Please check email for Reset Password</b-alert
          >
          <b-form @submit.prevent="onSubmit" v-show="!isSuccess">
            <div class="my-5">
              <p class="my-1 text-secondary">Email</p>
              <input
                class="inputset"
                required
                type="email"
                v-model="form.user_email"
              />
            </div>
            <b-button type="submit" class="blue btn-block my-4 rounded-pill"
              >Send</b-button
            >
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div> -->
</template>

<script>
import CardAuth from '../../components/_base/CardAuth'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ForgotPassword',
  components: {
    CardAuth
  },
  data() {
    return {
      form: {
        user_email: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getLoading'])
  },
  methods: {
    ...mapActions(['sendEmailPassword']),
    onSubmit() {
      this.sendEmailPassword(this.form)
        .then((result) => {
          this.makeToast('success', 'Success', result.message)
        })
        .catch((error) => {
          this.makeToast('danger', 'Error', error.data.message)
        })
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
