<template>
	<div class="backpack-wrapper col-md-7">
		<div class="tabs">
			<button
				v-for="(tab, key) in tabs"
				:key="tab"
				:class="['tab-button', { active: currentTab === key }]"
				@click="currentTab = key"
			>
				{{ tab }}
			</button>
		</div>
		<div class="backpack-items">
			<div v-if="currentTab === 'main'">
				<small class="center">Вещи</small>
				<div v-for="item in itemsByType[currentTab]['armor']" :key="item" class="item">
					<armor-item 
						:item="item" 
						@setActiveItem="setActiveItem"
					></armor-item>
				</div>
				
				<small class="center">Расходные материалы</small>
				<div v-for="item in itemsByType[currentTab]['potions']" :key="item" class="item">
					<armor-item 
						:item="item" 
						@setActiveItem="setActiveItem"
					></armor-item>
				</div>

			</div>

			<div v-else>
				<div v-for="item in itemsByType[currentTab]" :key="item" class="item">
					<armor-item 
						:item="item" 
						@setActiveItem="setActiveItem"
					></armor-item>
				</div>
			</div>
		</div>
		
		<item-info :item="activeItem"></item-info>
	</div>
</template>

<script>
import ItemInfo from '@/js/components/modal/ItemInfo'
import ArmorItem from './ArmorItem'

export default {
	props: {
		items: Array
	},

	data() {
		return {
			tabs: { main: 'Вещи', other: 'Разное', quest: 'Квесты', gift: 'Подарки' },
			itemProps: '',
			activeItem: false,
			currentTab: 'main',
			itemsByType: {
				main: {
					armor: [],
					potions: [],
				},
				other: [],
				quest: [],
				gift: [],
			}
		}
	},

	methods: {
		setActiveItem(item) {
			this.activeItem = item;
		}
	},

	computed: {

	},

	watch: {
		items(items) {
			items.forEach(item => {
				if (item.item_type !== 'fish' && 
					item.item_type !== 'gift' &&
					item.item_type !== 'quest') {
					this.itemsByType.main[item.item_type === 'potion' ? 'potions' : 'armor'].push(item);
				} else if (item.item_type === 'fish') {
					this.itemsByType.other.push(item);
				} else if (item.item_type === 'quest') {
					this.itemsByType.quest.push(item);
				} else if (item.item_type === 'gift') {
					this.itemsByType.gift.push(item);
				}
			});
		}
	},

	components: { ItemInfo, ArmorItem }
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

	small {
		display: block;
		font-weight: bold;
		margin: 3px 0 5px;
		// background: gray;
		border-bottom: 1px solid #d5d5d5;
	}
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