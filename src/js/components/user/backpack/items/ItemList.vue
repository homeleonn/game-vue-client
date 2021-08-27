<template>
	<div class="backpack-wrapper col-md-7">
		<div class="tabs">
			<button
				v-for="tab in ['Вещи', 'Расх. материалы', 'Разное', 'Подарки']"
				:key="tab"
				:class="['tab-button', { active: currentTab === tab }]"
				@click="currentTab = tab"
			>
				{{ tab }}
			</button>
		</div>
		<div class="backpack-items">
			<div v-for="item in items" :key="item" class="item">
				<!-- {{ item }} -->
				<img :src="'/img/items/' + item.image" 
				@mouseenter="activeItem = item" 
				@mouseleave="activeItem = false">
			</div>
		</div>
		<item-info :item="activeItem"></item-info>
		<!-- <ItemInfo /> -->
	</div>
</template>

<script>
import ItemInfo from '@/js/components/modal/ItemInfo'

export default {
	props: ['items'],

	data() {
		return {
			itemProps: '',
			activeItem: false,
			currentTab: 'Вещи'
		}
	},

	methods: {
		// setActiveItem() {
		// 	this.activeItem = !this.activeItem;
		// }
	},

	components: { ItemInfo }
}
</script>

<style lang="scss">

.backpack-wrapper {

.backpack-items {
	background: #f4f4f4;
	padding: 10px;
	border: 1px solid #b5b5b5;
	position: relative;
	z-index: 1;
}

.item {
	display: inline-block;
	padding: 1px;
}

table, tr {
	// border: 1px white solid;
}

td {
	padding: 2px;
}

table > tr > td:nth-child(2) {
	display: inline-block;
	margin-left: 10px;
}


.tabs {
	display: flex;
	justify-content: space-between;
	position: relative;
	top: 1px;
	padding: 0 5px 0;

	> .tab-button {
		width: 25%;
		margin: 0 3px 0;
		padding: 4px;
		background: #f4f4f4;
		border: 1px solid #b5b5b5;
		border-bottom: 1px solid #f4f4f4;
		border-radius: 5px 5px 0 0;
		text-align: center;
		cursor: pointer;

		&.active {
			position: relative;
			z-index: 2;
			font-weight: bold;
		}
	}
}


}
</style>