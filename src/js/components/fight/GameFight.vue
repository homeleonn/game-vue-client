<template>
	<div class="fight row">
		<div class="col-md-4">
			<user-form
				:items="[]"
				:user="user"
				:info="[]"
				isFight
				:damage="damageShow"
			></user-form>
			<div class="fighter-list">
				<div v-for="(f, idx) in teams[0]" :key="idx">
					<div>{{showFighter(f)}}</div>
				</div>
			</div>
			<!-- {{user}} -->
		</div>
		<div class="col-md-4 flex fcol fight-panel">
			<div v-if="isFightEnd"><b>Fight has finished!</b></div>
			<div><button @click="reset">Reset</button></div>
			<div v-if="turn">
				<div><button @click="hit(HIT_HEAD)">В голову</button></div>
				<div><button @click="hit(HIT_CHEST)">В корпус</button></div>
				<div><button @click="hit(HIT_LEGS)">В ноги</button></div>
			</div>
			{{swap}}<br>
			{{freeFighters}}
			<div>{{timer}}</div>
			<div v-for="log in damageLog" :key="log">
				{{log}}
			</div>
		</div>
		<div class="col-md-4">
			<user-form v-if="enemy"
				:items="[]"
				:user="enemy"
				:info="[]"
				isFight
			></user-form>
			<div class="fighter-list">
				<div v-for="(f, idx) in teams[1]" :key="idx">
					<div :class="{'active': enemy?.id == f.id}">{{showFighter(f)}}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import UserForm from '../user/form/UserForm'
import { mapGetters } from 'vuex'
// import { fight } from '../../use/fight/fight'

const enemyProto = { id: 1, name: 'Ящер', level: '0', curhp: '18', maxhp: '18', power: '5', critical: '5', evasion: '0', stamina: '4', aggr: '0', is_undead: '0', image: 'yashcher.jpg', min_damage: 2, max_damage: 8, login: 'Ящер' }
const HIT_HEAD = 1;
const HIT_CHEST = 2;
const HIT_LEGS = 3;

const hitVerbs = {
	[HIT_HEAD]: 'голову',
	[HIT_CHEST]: 'корпус',
	[HIT_LEGS]: 'ноги',
};
let mdt = null;
let timer = null;
let NpcId = 1e7;

export default {
	data() {
		return {
			teams: [
				{}, {}
			],
			enemy: null,
			swap: {},
			isFightEnd: false,
			turn: null,
			timer: null,
			damageLog: [],
			damageShow: [{ id: rand(1, 200), damage: '-1' }],
			freeFighters: [
				{}, {}
			],
		}
	},

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

		HIT_HEAD: () => HIT_HEAD,
		HIT_CHEST: () => HIT_CHEST,
		HIT_LEGS: () => HIT_LEGS,
	},

	mounted() {
		// this.api.doAction('getEnemy', 1);
		this._enemy(enemyProto);
	},

	methods: {
		reset() {
			this.swap = {};
			this._enemy(enemyProto);
			this.selectEnemy();
			this.damageLog = [];
			const secondsForHit = 20
			this.timer = secondsForHit;
			this.user.curhp = 100;
			// this.enemy.curhp = this.user.curhp = 100;
			// for (const k in this.teams[1]) { this.teams[1][k].curhp = 1; }

			mdt = this.monsterDamageTime();

			// this.stopTimer();
			// timer = setInterval(() => {
			// 	this.timer--;
			// 	if (!this.timer) {
			// 		this.timer = secondsForHit;
			// 		this.toggleTurn(this.user, this.enemy);
			// 	}

			// 	if (this.enemyTurn) {
			// 		if (this.timer < secondsForHit - mdt) {
			// 			this.hit(rand(1, 3));
			// 		}
			// 	}
			// }, 1000)
		},

		_enemy(enemy) {
			this.teams = [{}, {}];
			this.freeFighters = [{}, {}];
			this.user.team = 0;
			this.user.lastEnemyId = null;
			this.teams[this.user.team][this.user.id] = this.user;
			this.freeFighters[this.user.team][this.user.id] = null;
			this.createBots(enemy, 2, 1);
			this.createBots(enemy, 2, 0);
			this.setEnemy();
		},

		createBots(proto, count, team) {
			while (count--) {
				const enemyClone = Object.assign({}, proto, { id: NpcId++, team: team, lastEnemyId: null });
				this.teams[team][enemyClone.id] = enemyClone;
				this.freeFighters[team][enemyClone.id] = null;
			}
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
				delete this.freeFighters[defender.team][defender.id];
				this.checkEndFight(defender);
				return true;
			}

			return false;
		},

		checkEndFight(defender) {
			const team = defender.team;
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
				mdt = this.monsterDamageTime();
			}
		},

		damage(user) {
			return rand(user.min_damage, user.max_damage);
		},

		stopTimer() {
			clearInterval(timer);
		},

		selectEnemy() {
			const prevEnemy = this.enemy?.id;
			this.enemy = null;
			this.setEnemy();
			if (this.enemy) {
				this.selectTurn(prevEnemy !== this.enemy.id);
				this.setSwap(this.user, this.enemy);
			}
		},

		selectTurn(newTurn = true) {
			if (newTurn) {
				this.turn = !!rand(0, 1);
			} else {
				this.turn = !this.turn;
			}
		},

		setEnemy() {
			const freeTeamFightersIds = [[], []];
			const getRandFighter = (team, freeTeamFightersIds) => {
				return this.teams[team][freeTeamFightersIds[rand(0, freeTeamFightersIds.length - 1)]];
			}

			const getFreeTeamFightersIds = team => {
				const ids = Object.keys(this.freeFighters[team]);
				return ids.length ? ids : false;
			}

			freeTeamFightersIds[0] = getFreeTeamFightersIds(0);

			for (let i = 0; i < freeTeamFightersIds[0].length; i++) {
				freeTeamFightersIds[0] = getFreeTeamFightersIds(0); // Get free fighters id from first team
				if (!freeTeamFightersIds[0]) return;								// if no free figters then stop finding
				freeTeamFightersIds[1] = getFreeTeamFightersIds(1); // Get free fighters id from second team
				if (!freeTeamFightersIds[1]) return;
				const fighter1 = getRandFighter(0, freeTeamFightersIds[0]); // Take a fighter from first team free fighters
				const fighter2 = getRandFighter(1, freeTeamFightersIds[1]); // Select opponent from second free fighters
				if (fighter1.id === this.user.id) this.enemy = fighter2; // set my enemy
				if (fighter2.id === this.user.id) this.enemy = fighter1; // set my enemy
				delete this.freeFighters[fighter1.team][fighter1.id]; // remove fighter 1 from free
				delete this.freeFighters[fighter2.team][fighter2.id]; // remove fighter 2 from free
				this.setSwap(fighter1, fighter2);
			}
		},

		canSwap(f1, f2, newEnemy) {
			if (newEnemy || !--this.swap[f1.id].hits) {
				delete this.swap[f1.id];
				delete this.swap[f2.id];

				if (f1.curhp > 0) this.freeFighters[f1.team][f1.id] = null;
				if (f2.curhp > 0) this.freeFighters[f2.team][f2.id] = null;

				return true;
			}

			return false;
		},

		setSwap(f1, f2) {
			const swap = { f1, f2, hits: 2 };
			this.swap[f1.id] = swap;
			this.swap[f2.id] = swap;
		},

		setLog(hitter, defender, damage, hitType) {
			this.damageLog.unshift(`${hitter.login}[${hitter.level}] ударил ${defender.login}[${defender.level}] в ${hitVerbs[hitType]} на -${damage}`);
		},

		monsterDamageTime() {
			const t = rand(0, 3);
			return t;
		},
		
		showFighter(f) {
			return `${f.id}:${f.login}[${f.level}](${f.curhp}/${f.maxhp})`;
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