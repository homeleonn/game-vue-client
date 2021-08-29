<template>
	<div class="pack">
		<div class="row">
			<div class="col-md-5">
				<h2>info</h2>
			</div>
			<item-lists :items="items"></item-lists>
		</div>
	</div>
</template>

<script>
import ItemLists from './items/ItemLists'

export default {
	components: { ItemLists },

	inject: [
		'api',
		'apiSubscribe'
	],

	data() {
		return {
			items: [],
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

	methods: {
		backpack(backpack) {
			this.items = backpack;
		}
	}
}	
</script>

<style lang="scss">
.pack {
	padding-top: 5px;
}
</style>