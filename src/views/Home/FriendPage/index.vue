<template>
  <div>
    <div class="overflow-auto">
      <b-tabs content-class="mt-4">
        <b-card-text>
          <div class="text-center">
            <h5 class="text-dark mb-3">No friends yet</h5>
            <button
              class="btn btn-sm btn-success"
              @click="$bvModal.show('friend-list')"
            >
              Find Friends <b-icon icon="search" />
            </button>
          </div>
        </b-card-text>
      </b-tabs>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  methods: {},
  computed: {}
}
</script>

<style scoped></style>
