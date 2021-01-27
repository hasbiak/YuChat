<template>
  <div id="auth">
    <div class="container">
      <div class="row">
        <div class="col-lg-5 col-md-8 col-sm-12 mx-auto">
          <div class="card border-0">
            <div class="card-body px-5 py-4">
              <router-link v-if="needBack" :to="{ name: 'Login' }">
                <g-image class="back-icon" url="icon/back.svg" />
              </router-link>
              <div class="card-title">{{ title }}</div>
              <p class="card-description mb-4">{{ description }}</p>
              <slot name="body"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: String,
    title: String,
    needBack: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.back-icon {
  position: absolute;
  top: 32px;
}
#auth {
  background-color: #f6f6f6;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card-title {
  color: #7e98df;
  font-size: 22px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 500;
}
.card-description {
  font-size: 14px;
}
#auth .card {
  box-shadow: 0px 20px 20px rgba(126, 152, 223, 0.05);
  border-radius: 30px;
}
</style>
