<template>
	<div
		v-for="(location, id) in closestLocations[type]"
		:key="'link-loc-' + id"
		:class="['link', 'loc-' + id, {active: activeLocation == id, disabled: disabled && type != 'character'}]"
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

	props: ['closestLocations', 'type', 'disabled'],
	emits: ['chloc'],
	inject: ['api', 'talkToNpc'],

	methods: {
		...mapMutations(['SET_ACTIVE_LOCATION']),

		test(id) {
			if (this.type == 'character') return this.talkToNpc(id);
			if (this.disabled) return;
			this.$emit('chloc', id);
		}
	},

	computed: {
		...mapGetters([
			'activeLocation',
		])
	},

	mounted() {
		// api.subscribe('')
	}

}
</script>

<style scoped>
.location-block > .list > .link.disabled {
	opacity: .4;
}
</style>
