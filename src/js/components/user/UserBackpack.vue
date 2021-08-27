<template>
	<div class="pack">
		<div class="row">
			<div class="col-md-5">
				<h2>info</h2>
			</div>
			<div class="col-md-7">
				<h2>items</h2>
				<list-items :items="items"></list-items>
			</div>
		</div>
	</div>
</template>

<script>
import ListItems from './ListItems'

export default {
	data() {
		return {
			items: []
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