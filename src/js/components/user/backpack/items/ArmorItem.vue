<template>
	<img 
		:src="item.image" 
		@mouseenter="$emit('setActiveItem', item)" 
		@mouseleave="$emit('setActiveItem', false)"
	>
</template>

<script>
export default {
	props: {
		item: Object
	},

	emits: ['setActiveItem']
}
</script>