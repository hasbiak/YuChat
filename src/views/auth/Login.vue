<template>
  <CardAuth title="Login" description="Hi, Welcome back!">
    <template #body>
      <form @submit.prevent="onSubmit">
        <div class="form-group-auth">
          <ValidationProvider name="email" rules="required|email">
            <div slot-scope="{ errors, classes }">
              <label>Email</label>
              <small class="d-block text-danger">{{ errors[0] }}</small>
              <input
                type="email"
                v-model="form.user_email"
                name="email"
                class="form-control"
                :class="classes"
              />
            </div>
          </ValidationProvider>
        </div>
        <div class="form-group-auth">
          <ValidationProvider name="email" rules="required">
            <div slot-scope="{ errors, classes }">
              <label>Password</label>
              <small class="d-block text-danger">{{ errors[0] }}</small>

              <input
                type="password"
                v-model="form.user_password"
                name="password"
                class="form-control"
                :class="classes"
              />
            </div>
          </ValidationProvider>
        </div>
        <router-link
          :to="{ name: 'ForgotPassword' }"
          class="float-right font-14 my-2 text-decoration-none"
          >Forgot Password ?</router-link
        >
        <div class="clearfix"></div>
        <g-button
          type="submit"
          :isLoading="getLoading"
          class="btn btn-lb btn-block mt-3 p-auth rounded-pill"
          >Login</g-button
        >
        <div class="log-with my-4 border-bottom text-center position-relative">
          <span class="bg-white p-3 font-13">Login With</span>
        </div>
        <button
          type="button"
          class="btn btn-outline-lb btn-block p-auth rounded-pill d-flex align-items-center justify-content-center"
        >
          <g-image url="icon/google.svg" class="mr-2" />Google
        </button>
        <p class="text-center mt-4 mb-0 font-14">
          Don’t have an account?
          <router-link :to="{ name: 'Register' }">Sign Up</router-link>
        </p>
      </form>
    </template>
  </CardAuth>
</template>

<script>
import CardAuth from '../../components/_base/CardAuth'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Login',
  components: {
    CardAuth
  },
  data() {
    return {
      form: {
        user_email: '',
        user_password: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getLoading'])
  },
  methods: {
    ...mapActions(['login', 'patchActivity']),
    onSubmit() {
      this.login(this.form)
        .then((result) => {
          this.makeToast('success', 'Success', result.message)
          setTimeout(() => {
            if (
              result.data.user_about === null ||
              result.data.user_about === '' ||
              result.data.user_phone === null ||
              result.data.user_phone === ''
            ) {
              this.$router.push('/profile-user')
            } else {
              const patchActive = {
                id: result.data.user_id,
                form: {
                  user_activity: 1,
                  user_updated_at: new Date()
                }
              }
              this.patchActivity(patchActive)
              this.$router.push('/home')
            }
          }, 1500)
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
