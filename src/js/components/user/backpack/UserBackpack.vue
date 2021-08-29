<template>
	<div class="pack">
		<div class="row">
			<div class="col-md-5">
				<h2>info</h2>
			</div>
			<item-list :items="items"></item-list>
		</div>
	</div>
</template>

<script>
import ItemList from './items/ItemList'

export default {
	data() {
		return {
			items: [],
		}
	},

	inject: [
		'api',
		'apiSubscribe'
	],

	methods: {
		backpack(backpack) {
			this.items = backpack;
		}
	},

	created() {
		this.apiSubscribe([
			'backpack'
		], this);
	},

	mounted() {
		this.api.getBackPack();
	},

	components: { ItemList }
}	
</script>

<style lang="scss">
.pack {
	padding-top: 5px;
}
</style>