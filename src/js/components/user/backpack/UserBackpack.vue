<template>
	<div class="pack">
		<div class="row">
			<user-form :items="wearedItems"></user-form>
			<item-lists :items="packedItems"></item-lists>
		</div>
		<item-info></item-info>
	</div>
</template>

<script>
import ItemLists from './items/ItemLists'
import UserForm from './form/UserForm'
import ItemInfo from '../../modal/ItemInfo'

export default {
	components: { ItemLists, UserForm, ItemInfo },

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

	computed: {
		packedItems() {
			// return this.items;
			return this.items.filter(item => item.loc === 'INVENTORY');
		},

		wearedItems() {
			return this.items.filter(item => item.loc === 'WEARING');
		}
	},

	methods: {
		backpack(backpack) {
			this.items = backpack;
			// cl(backpack);
		}
	}
}	
</script>

<style lang="scss">
.pack {
	padding-top: 5px;
}
</style>