<template>
	<div class="hunting">
		<h1 class="center">Охота</h1>
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

	emits: ['setCurComp'],

	data() {
		return {
			monsters: []
		}
	},

	created() {
		this.apiSubscribe([
			'locMonsters',
			'fight',
		], this);
	},

	mounted() {
		this.api.doAction('getLocMonsters');
	},

	methods: {
		locMonsters(monsters) {
			this.monsters = monsters;
		},

		attack(monsterId) {
			// this.$emit('setCurComp', 'GameFight');
			this.api.doAction('attackMonster', monsterId);
		}
	}
}
</script>

<style lang="scss">

.monsters {
	justify-content: center;

	.monster {
		width: 100px;
		margin: 10px;
	}
}
</style>