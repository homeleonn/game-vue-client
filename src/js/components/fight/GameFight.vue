<template>
	<div class="fight row" v-if="enemy">
		<div class="col-md-4">
			<user-form
				:items="[]"
				:user="user"
				:info="[]"
				isFight
				:damage="damageShow"
			></user-form>
			{{user}}
		</div>
		<div class="col-md-4 flex fcol fight-panel">
			<div v-if="isFightEnd"><b>Fight has finished!</b></div>
			<div><button @click="reset">Reset</button></div>
			<div v-if="turn">
				<div><button @click="hit(HIT_HEAD)">В голову</button></div>
				<div><button @click="hit(HIT_CHEST)">В корпус</button></div>
				<div><button @click="hit(HIT_LEGS)">В ноги</button></div>
			</div>
			{{swap}}
			<div>{{timer}}</div>
			<div v-for="log in damageLog" :key="log">
				{{log}}
			</div>
		</div>
		<div class="col-md-4">
			<user-form
				:items="[]"
				:user="enemy"
				:info="[]"
				isFight
			></user-form>
			<div class="fighter-list">
				<div v-for="(e, idx) in teams[1]" :key="idx">
					<div :class="{'active': enemy.id == e.id}">{{e.id}}:{{e.login}}[{{e.level}}]({{e.curhp}}/{{e.maxhp}})</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import UserForm from '../user/form/UserForm'
import { mapGetters } from 'vuex'


export default {
	data() {
		return {
			teams: [
				{}, {}
			],
			enemyProto: { id: 1, name: 'Ящер', level: '0', curhp: '18', maxhp: '18', power: '5', critical: '5', evasion: '0', stamina: '4', aggr: '0', is_undead: '0', image: 'yashcher.jpg', min_damage: 2, max_damage: 8, login: 'Ящер' },
			enemy: null,
			swap: {},
			isFightEnd: false,
			turn: null,
			timer: null,
			damageLog: [],
			HIT_HEAD: 1,
			HIT_CHEST: 2,
			HIT_LEGS: 3,
			damageShow: [{ id: rand(1, 200), damage: '-1' }]
		}
	},

	hitVerbs: {
		1: 'голову',
		2: 'корпус',
		3: 'ноги',
	},
	mdt: null,
	timer: null,
	cloneCount: 3,
	aliveEnemies: [
		{}, {}
	],

	inject: [
		'api',
		'apiSubscribe'
	],

	created() {
		this.apiSubscribe([
			'_enemy'
		], this);
	},

	computed: {
		...mapGetters(['user']),
		enemyTurn() {
			return !this.turn;
		},

		enemyList() {
			return 1;
		}
	},

	mounted() {
		// this.api.doAction('getEnemy', 1);
		this._enemy(this.enemyProto);

		// setTimeout(() => {
		// 	this.damageShow.push('-2')
		// }, 2000)

		// setTimeout(() => {
		// 	this.damageShow.push('-5')
		// }, 5000)
	},

	updated() {
		// _('.fight-panel button').on('click', function() {
		// 	cl(2)
		// })
	},

	methods: {
		_enemy(enemy) {
			this.teams[1] = {};
			const NpcId = 1e7;
			let whilecc = this.$options.cloneCount;
			while (whilecc--) {
				const enemyClone = Object.assign({}, enemy, { id: NpcId + whilecc });
				// this.teams[1].push(enemyClone);
				this.teams[1][enemyClone.id] = enemyClone;
				this.$options.aliveEnemies[1][enemyClone.id] = null;
			}
			// this.$options.aliveEnemies[1].length = this.$options.cloneCount;
			this.setEnemy();
		},

		hit(type) {
			const hitter = !this.enemyTurn ? this.user : this.enemy;
			const defender = this.enemyTurn ? this.user : this.enemy;
			const damage = this.damage(hitter);
			defender.curhp -= damage;
			this.setLog(hitter, defender, damage, type);
			const isFighterDeath = this.checkFighterDeath(defender)
			this.toggleTurn(hitter, defender, isFighterDeath);
		},

		checkFighterDeath(defender) {
			if (defender.curhp <= 0) {
				defender.curhp = 0;
				delete this.$options.aliveEnemies[1][defender.id];
				// this.$options.aliveEnemies[1].length--;
				this.checkEndFight(defender)
				return true;
			}

			return false;
		},

		checkEndFight(defender) {
			const team = !this.enemyTurn ? 1 : 0;
			this.isFightEnd = !this.checkAliveTeam(this.teams[team]);

			if (this.isFightEnd) {
				this.stopTimer();
			}

			return this.isFightEnd;
		},

		checkAliveTeam(team) {
			for (const fId in team) {
				if (team[fId].curhp > 0) {
					return true;
				}
			}

			return false;
		},

		toggleTurn(f1, f2, newEnemy = false) {
			if (this.isFightEnd) return;
			if (this.canSwap(f1, f2, newEnemy)) {
				this.selectEnemy();
			} else {
				this.selectTurn(false);
			}

			this.timer = 20;
			if (this.enemyTurn) {
				this.$options.mdt = this.monsterDamageTime();
			}
		},

		canSwap(f1, f2, newEnemy) {
			if (newEnemy || !--this.swap[f1.id].hits) {
				delete this.swap[f1.id];
				delete this.swap[f2.id];
				return true;
			}

			return false;
		},

		damage(user) {
			return rand(user.min_damage, user.max_damage);
		},

		reset() {
			this.swap = {};
			this._enemy(this.enemyProto);
			this.selectEnemy();
			this.damageLog = [];
			const secondsForHit = 20
			this.timer = secondsForHit;
			this.user.curhp = 100;
			// this.enemy.curhp = this.user.curhp = 100;
			for (const k in this.teams[1]) { this.teams[1][k].curhp = 1; }

			this.$options.mdt = this.monsterDamageTime();

			this.stopTimer();
			this.$options.timer = setInterval(() => {
				this.timer--;
				if (!this.timer) {
					this.timer = secondsForHit;
					this.toggleTurn(this.user, this.enemy);
				}

				if (this.enemyTurn) {
					if (this.timer < secondsForHit - this.$options.mdt) {
						this.hit(rand(1, 3));
					}
				}
			}, 1000)
		},

		stopTimer() {
			clearInterval(this.$options.timer);
		},

		selectEnemy() {
			const prevEnemy = this.enemy.id;
			this.setEnemy();
			this.selectTurn(prevEnemy !== this.enemy.id);
			this.setSwap(this.user, this.enemy);
		},

		selectTurn(newTurn = true) {
			if (newTurn) {
				this.turn = !!rand(0, 1);
			} else {
				this.turn = !this.turn;
			}
		},

		setEnemy() {
			const aliveEnemiesIds = Object.keys(this.$options.aliveEnemies[1]);
			if (aliveEnemiesIds.length) {
				this.enemy = this.teams[1][aliveEnemiesIds[rand(0, aliveEnemiesIds.length - 1)]];
			} else {
				this.enemy = this.teams[1][Object.keys(this.teams[1])[0]];
			}
		},

		setSwap(f1, f2) {
			const swap = { hits: 2 };
			this.swap[f1.id] = swap;
			this.swap[f2.id] = swap;
		},

		setLog(hitter, defender, damage, hitType) {
			this.damageLog.unshift(`${hitter.login}[${hitter.level}] ударил ${defender.login}[${defender.level}] в ${this.$options.hitVerbs[hitType]} на -${damage}`);
		},

		monsterDamageTime() {
			const t = rand(0, 3);
			// cl(t);
			return t;
		},
	},

	components: { UserForm }
}
</script>

<style lang="scss">
.fight {
	.user-form-wrapper {
		margin: 0 auto;
	}
	justify-content: space-between;

	.fight-panel {
		text-align: center;
		margin-top: 20px;
		button {
			min-width: 100px;
			display: block;
			margin: 10px auto;
		}
	}

	.fighter-list {
		text-align: center;
		.active {
			font-weight: bold;
		}
	}
}
</style>