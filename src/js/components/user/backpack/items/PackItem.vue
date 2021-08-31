<template>
	<div class="pack-item">
		<img 
			:src="item.image" 
			@mouseenter="setActive(item)" 
			@mouseleave="setActive(false)" 
		>
		<div class="tl"><slot name="tl"></slot></div>
		<div class="tr"><slot name="tr">i</slot></div>
		<div class="bl"><slot name="bl"></slot></div>
		<div class="br"><slot name="br">x</slot></div>
	</div>
	
</template>

<script>
import { mapMutations } from 'vuex'

export default {
	props: {
		item: Object
	},

	methods: {
		...mapMutations(['SET_ACTIVE_ITEM']),

		setActive(item) {
			if (!this.item.id) return;

			this.SET_ACTIVE_ITEM(item);
		}
	}
}
</script>

<style lang="scss">
.pack-item {
position: relative;
line-height: 1.5;

 > div {
	text-align: center;

	position: absolute;
	width: 20px;
	height: 20px;
	color: white;
	//font-weight: bold;

	&.br {
		background: rgba(255, 0, 0, .6);
		border: 2px gold solid;
		border-radius: 4px;
		bottom: 0;
		right: 0;
		cursor: pointer;
	}

	&.tr {
		background: rgba(0, 0, 255, .6);
		border: 2px gold solid;
		border-radius: 50%;
		top: 0;
		right: 0;
		cursor: pointer;
	}
}

}
</style>