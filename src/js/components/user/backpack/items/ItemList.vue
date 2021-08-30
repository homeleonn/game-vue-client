<template>
	<slot></slot>
	<div v-for="item in items" :key="item" class="item">
		<pack-item :item="item"></pack-item>
	</div>
</template>

<script>
import PackItem from './PackItem'

export default {
	components: { PackItem },
	props: {
		items: Object
	}
}
</script>