<template>
  <button @click="$emit('cus-click')" class="btn" :disabled="isLoading">
    <div v-if="isLoading">
      <b-spinner small></b-spinner>
      <span class="sr-only">Loading...</span>
    </div>
    <slot v-if="!isLoading"></slot>
  </button>
</template>

<script>
export default {
  name: 'g-button',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped></style>
