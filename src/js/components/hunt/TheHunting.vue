<template>
	<div class="hunting">
		<h1 class="center">Охота</h1>
		<div class="monsters row" v-if="monsters.length">
			<div class="monster row" v-for="monster in monsters" :key="monster">
				<div class="center b">{{ monster.name }}</div>
				<div>
					<div class="mark fight-mark" title="В бою" v-if="monster.fight"><img src="/img/tendencies/neutral.gif"></div>
					<div class="mark level-mark">{{ monster.level }}</div>
					<img :src="'img/npc/' + monster.image">
				</div>
				<button @click="attack(monster.id)">Напасть</button>
			</div>
		</div>
		<div v-else>
			<h2 class="center">Живых монстров в данной локации нет</h2>
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
			fight: (action) => { },
			monsterAttacked: (monsterId) => {
				if (!this.monsters.length) return;
				this.monsters.forEach(m => {
					if (m.id != monsterId) return;
					m.fight = true;
				});
			},
			killMonster: (monsterId) => { this.monsters = this.monsters.filter(m => m.id != monsterId) },
			spawnMonster: (monster) => { this.monsters.push(monster) },
		});
	},

	beforeUnmount() {
		// ['locMonsters', 'fight', 'monsterAttacked', 'killMonster', 'spawnMonster'].forEach(e => this.api.unsubscribe(e));
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
				this.$store.commit('CLEAR_FIGHT_LOG');
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
		margin: 10px 20px;
		position: relative;

		.mark {
			position: absolute;
			top: 8px;
			border-radius: 50%;
			padding: 5px 8px;
			cursor: pointer;
			border: 3px gold solid;
		}

		.fight-mark {
			right: -10px;
			background: #fb8662;
		}

		.level-mark {
			padding: 2px 9px;
			font-weight: bold;
			left: -10px;
			background: #eee;
		}
	}
}
</style>
