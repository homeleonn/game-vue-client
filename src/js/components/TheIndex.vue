<script>
import {defineAsyncComponent} from "vue";

const TheLogin = defineAsyncComponent(() =>
  import('./TheLogin.vue')
)
const Game = defineAsyncComponent(() =>
  import('./Game.vue')
)
export default {
  name: "TheIndex",

  data() {
    return {
      currentComponent: null
    }
  },

  methods: {
    setCurrentComponent(cc) {
      this.currentComponent = cc === 'Game' ? Game : TheLogin;
    }
  },

  created() {
    this.currentComponent =
    sessionStorage.getItem('jwt') === null
     || sessionStorage.getItem('jwt') === "undefined" ? TheLogin : Game;
  }
}
</script>

<template>
  <component :is="currentComponent" @setCurrentComponent="setCurrentComponent"></component>
</template>

<style scoped lang="scss">

</style>
