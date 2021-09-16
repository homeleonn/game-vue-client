<template>
	<div class="pack-item">
		<template v-if="item.id">
			<img
				:src="item.image"
				@mouseenter="setActive(item)"
				@mouseleave="setActive(false)"
			>

			<div
				v-if="usage"
				class="action tl"
				@mouseenter="itemTitle=usage"
				@click="use(item, usage)"
			>
				н
			</div>
			<div
				class="action tr"
				@mouseenter="itemTitle='Информация'"
				@click="info"
			>
				i
			</div>
			<div
				class="action br"
				@mouseenter="itemTitle='Выбросить'"
				@click="remove(item)"
			>
				x
			</div>
			<div class="pack-item__title">{{ itemTitle }}</div>
		</template>
		<template v-else><img :src="item.image"></template>
	</div>
</template>

<script>
import { mapMutations } from 'vuex'

const STAMINA_RATE = 6;

export default {
	props: {
		item: Object,
		usage: {
			type: String,
			validator: (val) => [null, 'Надеть', 'Снять', 'Исп-ть'].includes(val),
			default: null
		}
	},

	emits: ['removeItem', 'wearItem'],

	data() {
		return {
			itemTitle: null,
		}
	},

	methods: {
		...mapMutations(['SET_ACTIVE_ITEM', 'SET_NEED_REGENERATION']),
		setActive(item) {
			this.SET_ACTIVE_ITEM(item);
		},

		remove (item) {
			if (!confirm('Точно выбрость?')) return false;
			this.$store.commit('REMOVE_ITEM', item.id);
		},

		use(item, usage) {
			if (usage === 'Надеть') {
				this.updateUser(item, 'on');
				this.$store.commit('PUT_ON_ITEM', item.id);
			} else {
				this.updateUser(item, 'off');
				this.$store.commit('TAKE_OFF_ITEM', item.id);
			}
		},

		updateUser(item, action) {
			const user = this.$store.state.user;
			const addProps = ['power', 'critical', 'evasion', 'stamina', 'hp', 'min_damage', 'max_damage'];
			let userProp;
			const isAdd = action === 'on';

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
		}
	}
}
</script>

<style lang="scss">
.pack-item {
	overflow: hidden;
	display: flex;
	position: relative;
	line-height: 1.5;
	align-items: center;
	border: 1px solid #d5d5d5;

	> img {
		width: 60px;
		height: 60px;
	}

	&:hover {
		> .action {
			display: block;
		}
	}

	&__title {
		font-size: 9px;
		display: none;
		text-align: center;
		position: absolute;
		background: gold;
		width: 100%;
	}

	.action {
		display: none;
		text-align: center;
		position: absolute;
		width: 20px;
		height: 20px;
		color: white;
		border: 2px gold solid;
		border-radius: 50%;
		cursor: pointer;
		line-height: 15px;
		opacity: 0.4;
		margin: 1px;

		&.br {
			background: rgba(255, 0, 0, 1);
			bottom: 0;
			right: 0;
		}

		&.tr {
			background: rgba(0, 0, 255, 1);
			top: 0;
			right: 0;
		}

		&.tl {
			background: rgba(0, 255, 0, 1);
			top: 0;
		}


		&:hover {
			opacity: 1;

			~ .pack-item__title {
				display: block;
			}
		}
	}
}
</style>
