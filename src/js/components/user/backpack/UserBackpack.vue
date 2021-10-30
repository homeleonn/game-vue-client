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
				@takeoffItem="takeoffItem"
				@wearItem="wearItem"
			></item-lists>
		</div>
		<item-info></item-info>
	</div>
</template>

<script>
import ItemLists from './items/ItemLists'
import UserForm from '../form/UserForm'
import ItemInfo from '../../modal/ItemInfo'
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
		...mapMutations(['SET_NEED_REGENERATION']),
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
			let action, actionType;
			if (type == 'ON') {
				action = 'wearItem';
				actionType = 'PUT_ON_ITEM';
			} else {
				action = 'takeoffItem';
				actionType = 'TAKE_OFF_ITEM';
			}

			this.api.doAction(action, item.id, response => {
				if (!isAllow(response)) return;
				this.updateUser(item, type);
				this.$store.commit(actionType, item.id);
			});
		},

		updateUser(item, action) {
			const user = this.$store.state.user;
			const addProps = ['power', 'critical', 'evasion', 'stamina', 'hp', 'min_damage', 'max_damage'];
			let userProp;
			const isAdd = action === 'ON';

			addProps.forEach(prop => {
				let needRegen = false;

				userProp = prop;

				if (prop === 'hp') {
					userProp = 'maxhp';
					needRegen = true;
				} else if (prop === 'stamina') {
					this.updateUserProps(user, 'maxhp', item[prop] * STAMINA_RATE, isAdd);
					needRegen = true;
				} else if (prop === 'min_damage' || prop === 'max_damage') {
					userProp = `extra_${prop}`;
				}

				this.updateUserProps(user, userProp, item[prop], isAdd);

				if (prop === 'power') {
					this.recalculateDamage(user);
				}

				if (needRegen) {
					this.SET_NEED_REGENERATION(true);
				}
			});
		},

		updateUserProps(user, prop, amount, isAdd) {
			user[prop] = isAdd === true ? user[prop] + +amount : user[prop] - +amount;
		},

		recalculateDamage(user) {
			user.min_damage = Math.floor(user.power / 2);
			user.max_damage = user.power + Math.ceil(user.power / 2);
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
