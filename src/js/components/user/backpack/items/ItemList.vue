<template>
	<slot></slot>
	<div v-for="item in items" :key="item" class="item">
		<pack-item 
			:item="item" 
			@setActiveItem="item => $emit('setActiveItem', item)"
		></pack-item>
	</div>
</template>

<script>
import PackItem from './PackItem'

export default {
	components: { PackItem },
	props: {
		items: Object
	},
	emits: ['setActiveItem']
}
</script>