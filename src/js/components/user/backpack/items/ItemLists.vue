<template>
	<div class="backpack-wrapper col-xl-7">
		<div class="tabs">
			<button
				v-for="(tab, key) in $options.tabs"
				:key="tab"
				:class="['tab-button', { active: currentTab === key }]"
				@click="currentTab = key"
			>
				{{ tab }}
			</button>
		</div>
		<div class="backpack-items">

			<div v-if="currentTab === 'main'">
				<item-list
				:items="itemsByType.armors"
				usage="Надеть"
				@removeItem="itemId => $emit('removeItem', itemId)"
				@wearItem="itemId => $emit('wearItem', itemId)"
			>
				<small class="center">Вещи</small>
			</item-list>

				<item-list
					:items="itemsByType.supplies"
					usage="Исп-ть"
					@removeItem="itemId => $emit('removeItem', itemId)"
					@wearItem="itemId => $emit('wearItem', itemId)"
				>
					<small class="center">Расходные материалы</small>
				</item-list>
			</div>

			<div v-else>
				<item-list
				:items="itemsByType[currentTab]"
				@removeItem="itemId => $emit('removeItem', itemId)"
			></item-list>
		</div>

		</div>
	</div>
</template>

<script>
import ItemList from './ItemList'

export default {
	props: {
		items: Array
	},

	emits: ['removeItem', 'wearItem'],

	components: { ItemList },

	data() {
		return {
			itemIdCounter: 100,
			activeItem: false,
			currentTab: 'main',
			itemsByType: null
		}
	},

	tabs: { main: 'Вещи', others: 'Разное', quests: 'Квесты', gifts: 'Подарки' },
	itemTypes: {
		armors: ['armor', 'weapon'],
		supplies: ['potion', 'scroll'],
		others: ['fish', 'plant', 'trash'],
		quests: ['quest'],
		gifts: ['gift'],
	},

	created() {
		this.resetItemsByType();
	},

	computed: {
	},

	watch: {
		items(items) {
			this.resetItemsByType();
			// sort items by type
			items.forEach(item => {
				for (const [type, types] of Object.entries(this.$options.itemTypes)) {
					if (types.includes(item.item_type)) {
						this.itemsByType[type].push(item);
					}
				}
			});
		}
	},

	methods: {
		resetItemsByType() {
			this.itemsByType = {
				armors: [],
				supplies: [],
				others: [],
				quests: [],
				gifts: [],
			};
		}
	}
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
