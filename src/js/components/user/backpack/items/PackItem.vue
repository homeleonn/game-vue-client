<template>
	<div class="pack-item">
		<template v-if="item.id">
		<!-- <template> -->
			<img
				:src="item.image"
				@mouseenter="setActive(item)"
				@mouseleave="setActive(false)"
			>

			<!-- <div v-if="onlyShow"> -->
				<div
					v-if="usage && user.level >= item.need_level"
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
					v-if="usage != 'Снять'"
					class="action br"
					@mouseenter="itemTitle='Выбросить'"
					@click="remove(item)"
				>
					x
				</div>
			<!-- </div> -->
			<div class="action bl" v-if="count">{{ count }}</div>
			<div class="pack-item__title">{{ itemTitle }}</div>
		</template>
		<template v-else>
			<img :src="item.image">
			<div class="action bl" v-if="count">{{ count }}</div>
		</template>
	</div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
	props: {
		item: Object,
		onlyShow: {
			type: Boolean,
			default: false
		},
		usage: {
			type: String,
			validator: (val) => [null, 'Надеть', 'Снять', 'Исп-ть'].includes(val),
			default: null
		}
	},

	emits: ['removeItem', 'wearItem', 'takeoffItem'],

	data() {
		return {
			itemTitle: null,
		}
	},

	computed: {
		...mapGetters(['user']),

		count() {
			return this.item.count > 1 ? this.item.count : '';
		}
	},

	methods: {
		...mapMutations(['SET_ACTIVE_ITEM']),
		setActive(item) {
			this.SET_ACTIVE_ITEM(item);
		},

		remove (item) {
			if (!confirm('Точно выбрость?')) return false;
			this.$emit('removeItem', item);
		},

		use(item, usage) {
			this.$emit(usage === 'Надеть' || usage === 'Исп-ть' ? 'wearItem' : 'takeoffItem', item);
		},
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

		&.bl {
			background: gold;
			border-radius: 3px;
			bottom: 0;
			left: 0;
			display: block;
			opacity: .9;
			color: black;
			// position: relative;
			width: auto;
			height: auto;
			min-width: 19px;
			font-size: 11px;
			// line-height: 11px;
			font-weight: bold;
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


		&:hover:not(.bl) {
			opacity: 1;

			~ .pack-item__title {
				display: block;
			}
		}
	}
}
</style>
