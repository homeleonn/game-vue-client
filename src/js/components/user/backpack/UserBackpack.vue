<template>
	<div class="pack">
		<div class="row">
			<user-form :items="wearedItems" :user="$store.getters.user"></user-form>
			<item-lists :items="packedItems" @removeItem="removeItem" @wearItem="wearItem"></item-lists>
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
			// items: [],
		}
	},

	created() {
		this.apiSubscribe([
			'backpack'
		], this);
	},

	mounted() {
		this.api.doAction('getBackPack');
	},

	computed: {
		items() {
			return this.$store.state.userItems;
		},

		packedItems() {
			return this.filterByLoc(this.items, 'INVENTORY');
		},

		wearedItems() {
			return this.filterByLoc(this.items, 'WEARING');
		}
	},

	methods: {
		backpack(backpack) {
			// this.items = backpack;
			// cl(backpack);
			this.$store.commit('SET_USER_ITEMS', backpack);
		},

		removeItem(itemId) {
			this.api.doAction('removeItem', itemId);
		},

		wearItem(itemId) {
			this.api.doAction('wearItem', itemId);
		},

		filterByLoc(items, loc) {
			const filteredItems = [];
			
			for (const itemId in items) {
				if (items[itemId].loc === loc) {
					filteredItems.push(items[itemId]);
				}
			}

			return filteredItems;
		}
	}
}	
</script>

<style lang="scss">
.pack {
	padding-top: 5px;
}
</style>