<template>
  <CardAuth
    title="Activation Account"
    needBack
    description="Congratulation, Your Account is Active Now "
  >
    <template #body>
      <p class="my-4">
        You can login now,
        <router-link to="/login">
          <span style="color: #7e98df">Here</span>
        </router-link>
      </p>
    </template>
  </CardAuth>
</template>

<script>
import CardAuth from '../../components/_base/CardAuth'
import { mapActions } from 'vuex'

export default {
  name: 'SuccessActivate',
  components: {
    CardAuth
  },
  created() {
    this.activationAccount(this.$route.query.keys)
  },
  methods: {
    ...mapActions(['activationAccount'])
  }
}
</script>

<style src="@/assets/css/style.css"></style>
