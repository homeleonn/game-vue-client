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
				@click="use(item)"
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
			validator: (val) => [null, 'Надеть', 'Исп-ть'].includes(val),
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

			this.$emit('removeItem', item.id);
		},

		use(item) {
			this.$emit('wearItem', item.id);
		},

		info() {

		}

	}
}
</script>

<style lang="scss">
.pack-item {
display: flex;
position: relative;
line-height: 1.5;
align-items: center;


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