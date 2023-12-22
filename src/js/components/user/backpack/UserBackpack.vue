<template>
	<div class="pack">
		<div class="row">
			<user-form
				:items="wearedItems"
				:user="$store.getters.user"
				@takeoffItem="takeoffItem"
			></user-form>
			<item-lists
				:items="packedItems"
				@removeItem="removeItem"
				@wearItem="wearItem"
			></item-lists>
		</div>
		<item-info></item-info>
	</div>
</template>

<script>
import ItemLists from './items/ItemLists.vue'
import UserForm from '../form/UserForm.vue'
import ItemInfo from '../../modal/ItemInfo.vue'
import { isAllow } from '@/js/common'
import { mapGetters, mapMutations } from 'vuex'

const STAMINA_RATE = 6;

export default {
	components: { ItemLists, UserForm, ItemInfo },

	inject: [
		'api',
		'apiSubscribe'
	],

	data() {
		return {
			currentItem: null
		}
	},


	mounted() {
		this.api.doAction('getBackPack', '', items => {
			this.$store.commit('SET_USER_ITEMS', items);
		});

		this.apiSubscribe({
			wearItem: 	 itemId => { this.useReaction(itemId, 'ON') },
			takeoffItem: itemId => { this.useReaction(itemId, 'OFF') },
			removeItem:  itemId => { this.useReaction(itemId, 'REM') }
		})
	},

	computed: {
		...mapGetters(['user']),
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
		removeItem(item) {
			this.api.doAction('removeItem', item.id, response => {
				this.$store.commit('REMOVE_ITEM', item.id);
			});
		},

		wearItem(item) {
			if (item.need_level > this.user.level) {
				return this.$store.commit('SET_MODAL', { title: 'Уровень персонажа слишком мал для применения данной вещи' });
			}
			this.use(item, 'ON');
		},

		takeoffItem(item) {
			this.use(item, 'OFF');
		},

		use(item, type) {
			const [action] = this.identifyActionType(type);
			this.api.doAction(action, item.id);
		},

		useReaction(itemId, type) {
			if (!isAllow(itemId)) return;
			const [, actionType] = this.identifyActionType(type);
			this.$store.commit(actionType, itemId);
		},

		identifyActionType(type) {
			let action, actionType;
			if (type == 'ON') {
				action = 'wearItem';
				actionType = 'PUT_ON_ITEM';
			} else if (type == 'OFF') {
				action = 'takeoffItem';
				actionType = 'TAKE_OFF_ITEM';
			} else if (type == 'REM') {
				actionType = 'REMOVE_ITEM';
			}

			return [action, actionType];
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
