<template>
  <b-sidebar id="sidebar-profile" shadow backdrop width="455px">
    <div class="text-center mb-3">
      <b-avatar
        size="11rem"
        class="mb-1"
        :src="url + '/fileuploadsyuchat/' + user.user_image"
      >
      </b-avatar>
      <h4 class="text-lowercase">@{{ user.user_name.split(' ')[0] }}</h4>
    </div>
    <b-container class="side-profile">
      <b-row class="mt-5">
        <b-col cols="2" class="align-self-center text-center px-0">
          <b-icon icon="person-fill" font-scale="1.5"></b-icon>
        </b-col>
        <b-col cols="10" class="text-left">
          <p class="my-0 font-weight-bold">Name</p>
          <p class="my-0 text-uppercase">
            {{ user.user_name }}
          </p>
        </b-col>
        <b-col cols="12"><hr /></b-col>
        <b-col cols="2" class="align-self-center text-center px-0">
          <b-icon icon="exclamation-circle-fill" font-scale="1.5"></b-icon>
        </b-col>
        <b-col cols="10" class="text-left">
          <p class="my-0 font-weight-bold">About</p>
          <p class="my-0">{{ user.user_about }}</p>
        </b-col>
        <b-col cols="12"><hr /></b-col>
        <b-col cols="2" class="align-self-center text-center px-0">
          <b-icon icon="phone-fill" font-scale="1.5"></b-icon>
        </b-col>
        <b-col cols="10" class="text-left">
          <p class="my-0 font-weight-bold">Phone</p>
          <p class="my-0">{{ user.user_phone }}</p>
        </b-col>
        <b-col cols="12"><hr /></b-col>
        <b-col cols="2" class="align-self-center text-center px-0">
          <b-icon icon="envelope-fill" font-scale="1.5"></b-icon>
        </b-col>
        <b-col cols="10" class="text-left">
          <p class="my-0 font-weight-bold">Email</p>
          <p class="my-0">{{ user.user_email }}</p>
        </b-col>
        <b-col cols="12"><hr /></b-col>
        <b-col cols="12" class="text-left">
          <h5 class="mt-4 font-weight-bold text-center">Location</h5>
          <GmapMap
            :center="coordinate"
            :zoom="20"
            map-type-id="terrain"
            style="width: 100%; height: 300px"
          >
            <GmapMarker
              :position="coordinate"
              :clickable="true"
              :draggable="true"
              icon="https://img.icons8.com/color/48/000000/map-pin.png"
            />
          </GmapMap>
        </b-col>
        <b-col cols="12"><hr /></b-col>
      </b-row>
      <div class="mb-5 text-center">
        <routerLink to="/profile-user">
          <b-button size="sm">
            <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
            Edit Profile
          </b-button>
        </routerLink>
      </div>
    </b-container>
  </b-sidebar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SideProfile',
  data() {
    return {
      url: process.env.VUE_APP_BASE_URL,
      coordinate: {
        lat: 0,
        lng: 0
      }
    }
  },
  created() {
    this.$getLocation()
      .then((coordinates) => {
        this.coordinate = {
          lat: coordinates.lat,
          lng: coordinates.lng
        }
        const payload = {
          id: this.user.user_id,
          form: {
            user_lat: this.coordinate.lat,
            user_lng: this.coordinate.lng,
            user_updated_at: new Date()
          }
        }
        this.patchMaps(payload).then((response) => {
          this.getUserById(this.user.user_id)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
  computed: {
    ...mapGetters({ user: 'getUser' })
  },
  methods: {
    ...mapActions(['getUserById', 'patchMaps'])
  }
}
</script>

<style src="@/assets/css/style.css"></style>
