<template>
	<div class="supply-slots flex">
		<div class="supply-slot" v-for="idx in supplySlotsCount" :key="idx">
			<div v-if="supplies[idx - 1]">
				<img :src="'img/items/' + supplies[idx - 1].image">
				<div class="dome" @click="use(supplies[idx - 1].id)"></div>
			</div>
			<div class="dome" v-else></div>
		</div>
	</div>
</template>

<script>
export default {
name: "UserSupplies",

	data() {
		return {
			supplies: [
				{ id: 1, image: 'life_potion.gif' }
			],
			supplySlotsCount: 4
		}
	},

	methods: {
		use(itemId) {
			cl(itemId);
		},

	}
}
</script>

<style lang="scss">

.supply-slots {
	flex-direction: column;
	position: absolute;
	top: 5px;
	left: 5px;

	.supply-slot {
		width: 60px;
		height: 60px;
		margin: .5px;
		border: 4px #fcbebe solid;
		border-radius: 50%;
		background: radial-gradient(#fff, #867878);
		cursor: pointer;
		overflow: hidden;
		position: relative;

		img {
			width: 55px;
			height: 55px;
			position: relative;
			left: -2px;
			top: -2px;
		}

		.dome {
			display: none;
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			top: 0;
			left: 0;
			//background: radial-gradient(transparent, #867878);
			background: linear-gradient(to right bottom, transparent, rgba(0, 0, 0, .3));
			z-index: 2;
		}

		&:hover .dome {
			display: block;
		}
	}
}

</style>
