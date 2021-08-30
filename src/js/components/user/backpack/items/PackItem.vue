<template>
	<img 
		:src="item.image" 
		@mouseenter="SET_ACTIVE_ITEM(item)" 
		@mouseleave="SET_ACTIVE_ITEM(false)" 
	>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
	props: {
		item: Object
	},

	methods: {
		...mapMutations(['SET_ACTIVE_ITEM'])
	}
}
</script>