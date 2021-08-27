<template>
	<div class="pack">
		<div class="row">
			<div class="col-md-5">
				<h2>info</h2>
			</div>
			<list-items :items="items"></list-items>
		</div>
	</div>
</template>

<script>
import ListItems from './items/ItemList'

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

	components: { ListItems }
}	
</script>

<style lang="scss">
.pack {
	padding-top: 5px;
}
</style>