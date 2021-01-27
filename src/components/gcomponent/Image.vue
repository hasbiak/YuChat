<template>
  <img :src="require(`@/assets/images/${url}`)" :alt="alt" />
</template>

<script>
export default {
  props: {
    url: String,
    alt: {
      type: String,
      default: 'Image'
    }
  }
}
</script>

<style scoped></style>
