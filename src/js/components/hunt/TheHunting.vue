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
import { isAllow } from '@/js/common';

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
		this.apiSubscribe({
			locMonsters: (monsters) => { this.monsters = monsters },
			fight: (action) => { cl(this, action) },
		});
	},

	mounted() {
		this.api.doAction('getLocMonsters');
	},

	methods: {
		attack(monsterId) {
			this.api.doAction('attackMonster', monsterId, res => {
				if (!isAllow(res)) return;
				this.$emit('setCurComp', 'GameFight2');
				this.$store.state.user.fight = 1;
			});
		},
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
