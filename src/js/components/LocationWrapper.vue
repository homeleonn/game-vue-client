<template>
  <div id="location-wrapper">
    <div class="location">
      <div class="name">{{ location.name }}</div>
      <div class="svg-wrapper">
        <svg ref="svg">
        <template v-for="(coords, index) in location.loc_coords" :key="index">
          <polygon
            :class="[`loc-${index}`, {active: activeLocation == index}]"
            :points="coords"
            @mouseenter="SET_ACTIVE_LOCATION(index)"
            @mouseleave="SET_ACTIVE_LOCATION(false)"
            @click="$emit('chloc', index)"
          />
         </template>
        </svg>
      </div>
      <img src="" ref="image" class="map">
    </div>

    <div class="location-select">
      <div class="location-block locations">
        <div class="title">Локации</div>
        <div class="list">
          <location-link :closestLocations="closestLocations" type="location" @chloc="id => $emit('chloc', id)"></location-link>
        </div>
      </div>

      <div class="location-block objects">
        <div class="title">Объекты</div>
        <div class="list">
          <location-link :closestLocations="closestLocations" type="object" @chloc="id => $emit('chloc', id)"></location-link>
        </div>
      </div>

      <div class="location-block characters">
        <div class="title">Персонажи</div>
        <div class="list">
          <location-link :closestLocations="closestLocations" type="character" @chloc="id => $emit('chloc', id)"></location-link>
        </div>
      </div>

      <div class="location-pass">
        <div class="title"></div>
        <div class="progressbar">
          <div class="progress"></div>
        </div>
      </div>
    </div>

    <span class="loader"></span>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'
import LocationLink from "./location/LocationLink";

export default {
  name: "location-wrapper",
  components: { LocationLink },

  emits: ['chloc'],

  data: () => ({
    // activeLocation: false
  }),

  methods: {
    ...mapMutations(['SET_ACTIVE_LOCATION']),
    // ...mapActions(['changeLocation']),

    setLocationImage(location) {
      this.$refs.image.src = location.image == null ? 'img/other/no-image.png' 
                                                    : 'img/locations/' + location.image;
    }
  },

  computed: {
    ...mapGetters([
      'location',
      'closestLocations',
      'activeLocation',
    ])
  },

  watch: {
    location(location) {
      this.setLocationImage(location);
    }
  },


  mounted() {
    this.setLocationImage(this.location)
  }
}
</script>

<style scoped>

</style>
