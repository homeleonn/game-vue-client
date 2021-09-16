<template>
	<div class="hunting">
		<div class="monsters row">
			<div class="monster row" v-for="monster in monsters" :key="monster">
				<img :src="'img/npc/' + monster.image">
				<button @click="attack(monster.id)">Напасть</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	inject: [
		'api',
		'apiSubscribe'
	],

	data() {
		return {
			monsters: []
		}
	},

	created() {
		this.apiSubscribe([
			'locMonsters'
		], this);
	},

	mounted() {
		this.api.getMonsters();
	},

	methods: {
		locMonsters(monsters) {
			this.monsters = monsters;
			// cl(monsters);
		}
	}
}
</script>

<style lang="scss">

.monster {
	width: 100px;
	margin: 10px;

	img {
		// height: 200px;
	}
}

</style>