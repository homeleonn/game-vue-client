<template>
    <div
        v-for="(location, id) in closestLocations[type]"
        :key="'link-loc-' + id"
        :class="['link', 'loc-' + id, {active: activeLocation == id}]"
        @mouseenter="SET_ACTIVE_LOCATION(id)"
        @mouseleave="SET_ACTIVE_LOCATION(false)"
        @click="test(id)"
    >
        {{ location }}
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: "LocationLink",

    props: ['closestLocations', 'type'],
    emits: ['chloc'],

    methods: {
        ...mapMutations(['SET_ACTIVE_LOCATION']),

        test(id) {
            this.$emit('chloc', id);
        }
    },

    computed: {
        ...mapGetters([
            'activeLocation',
        ])
    },

    mounted() {
        // cl(this.closestLocations['location'])
    }

}
</script>

<style scoped>

</style>
