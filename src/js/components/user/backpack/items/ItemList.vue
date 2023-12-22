<template>
	<slot></slot>
	<h5 class="center" v-if="!items.length">Пусто</h5>
	<div v-for="item in items" :key="item" class="item">
		<pack-item
			:item="item"
			:usage="usage"
			@removeItem="itemId => $emit('removeItem', itemId)"
			@wearItem="itemId => $emit('wearItem', itemId)"
		></pack-item>
	</div>
</template>

<script>
import PackItem from './PackItem.vue'

export default {
	components: { PackItem },
	props: {
		items: Object,
		usage: String
	},

	emits: ['removeItem', 'wearItem'],
}
</script>
