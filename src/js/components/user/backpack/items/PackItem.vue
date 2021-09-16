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
			itemTitle: null
		}
	},

	methods: {
		...mapMutations(['SET_ACTIVE_ITEM']),
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
			const addStates = ['power', 'critical', 'evasion', 'stamina', 'hp'];
			let userState;

			addStates.forEach(state => {
				switch (state) {
					case 'hp': userState = 'maxhp'; break;

					default: userState = state;
				}

				user[userState] = action === 'on' ? user[userState] + +item[state] : user[userState] - +item[state];
			});


			this.$store.commit('SET_USER', user);
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
