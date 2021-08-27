<template>
	<div class="backpack-items">
		<div v-for="item in items" :key="item" class="item">
			<!-- {{ item }} -->
			<img :src="'/img/items/' + item.image" 
			@mouseenter="setItemProps(item)" 
			@mouseleave="itemProps = ''; activeItem = false">
		</div>
		<div class="item-info">
			<h3>{{ activeItem.name }}</h3>
			<hr>
			<table border="1">
				<tr v-for="prop in itemProps" :key="prop">
					<td>{{ prop.name }}:</td>
					<td>{{ prop.value }}</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
export default {
	props: ['items'],

	data() {
		return {
			itemProps: '',
			activeItem: false
		}
	},

	methods: {
		setItemProps(item) {
			this.activeItem = item;
			this.itemProps = [
				{ name: 'Тип', value: item.item_type },
				{ name: 'Материал', value: item.material },
				{ name: 'Вес', value: item.weight },
				{ name: 'Здоровье', value: '+' + item.hp },
				{ name: 'Цена', value: item.price },
			];
		}
	}
}
</script>

<style scoped>

.item {
	display: inline-block;
	padding: 1px;
}

.item-info {
	position: absolute;
	top: 0;
	right: 0;
	padding: 10px;
	background: rgba(0, 0, 0, .5);
	color: white;
	font-size: 20px;
}

table, tr {
	border: 3px white solid;
}

td {
	padding: 5px;
}

table > tr > td:nth-child(2) {
	display: inline-block;
	margin-left: 20px;
}
</style>