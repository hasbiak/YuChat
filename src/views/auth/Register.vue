<template>
  <CardAuth title="Register" needBack description="Let’s create your account!">
    <template #body>
      <form @submit.prevent="onSubmit">
        <div class="form-group-auth">
          <label>Name</label>
          <input
            type="text"
            v-model="form.user_name"
            name="name"
            class="form-control"
          />
        </div>
        <div class="form-group-auth">
          <label>Email</label>
          <input
            type="email"
            name="email"
            v-model="form.user_email"
            class="form-control"
          />
        </div>
        <div class="form-group-auth">
          <label>Password</label>
          <input
            type="password"
            name="password"
            v-model="form.user_password"
            class="form-control"
          />
        </div>
        <g-button
          type="submit"
          :isLoading="getLoading"
          class="btn-lb btn-block mt-4 p-auth rounded-pill"
          >Register</g-button
        >
        <div class="log-with my-4 border-bottom text-center position-relative">
          <span class="bg-white p-3 font-13">Register With</span>
        </div>
        <button
          type="button"
          class="btn btn-outline-lb btn-block p-auth rounded-pill d-flex align-items-center justify-content-center"
        >
          <g-image url="icon/google.svg" class="mr-2" />Google
        </button>
      </form>
    </template>
  </CardAuth>
</template>

<script>
import CardAuth from '../../components/_base/CardAuth'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  components: {
    CardAuth
  },
  data() {
    return {
      form: {
        user_name: '',
        user_email: '',
        user_password: ''
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters(['getLoading'])
  },
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
              this.makeToast(
                'info',
                'Register Success',
                'Check Your Email for Activation Account'
              )
              setTimeout(() => {
                this.$router.push('/login')
              }, 2000)
            })
            .catch((error) => {
              this.makeToast('danger', 'Error', error.data.message)
            })
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
