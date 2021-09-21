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
const NpcId = 1e7;
let NpcIdCounter = NpcId;
const secondsForHit = 20
const botsHits = {};

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
		// this._enemy(enemyProto);
		this.reset();
	},

	methods: {
		reset() {
			const enemy = enemyProto;
			this.swap = {};
			this.teams = [{}, {}];
			this.freeFighters = [{}, {}];
			this.damageLog = [];
			this.user.team = 0;
			this.user.lastEnemyId = null;
			this.teams[this.user.team][this.user.id] = this.user;
			this.freeFighters[this.user.team][this.user.id] = null;
			this.createBots(enemy, 2, 1);
			this.createBots(enemy, 2, 0);
			this.user.curhp = 100;
			this.setPairs();
			// this.timer = secondsForHit;
			// this.enemy.curhp = this.user.curhp = 100;
			// for (const k in this.teams[1]) { this.teams[1][k].curhp = 1; }

			// mdt = this.monsterDamageTime();

			// this.doHit();

			this.processBots();

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
		

		setPairs() {
			const prevEnemy = this.enemy?.id;
			this.enemy = null;
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

		processBots() {
			setInterval(() => {
				let hitter, defender;
				// cl(botsHits)
				for (const botId in botsHits) {
					if (this.isBotHitTime(botsHits[botId])) {
						// cl(1)
						hitter = this.swap[botId].f1.id === +botId ? 'f1' : 'f2';
						const team = this.swap[botId][hitter].team;
						const teamEnemy = !team ? 1 : 0;
						defender = this.teams[teamEnemy][this.swap[botId].[hitter !== 'f1' ? 'f1' : 'f2'].id];
						hitter = this.teams[team][botId];

						cl(this.teams, team, botId, hitter, defender);

						this.hit(hitter, defender, rand(1, 3));
					}
				}
			}, 2000);
		},

		isBotHitTime(botHitTime) {
			return getTimeSeconds() <= botHitTime;
		},

		// doHit() {
		// 	const processedSwap = {};
		// 	for (swap in this.swap) {
		// 		const s = this.swap[swap];
		// 		processedSwap[s.f1] = null;
		// 		processedSwap[s.f2] = null;

		// 		if (this.isBot(s.f1.id) && !s.turn) {
		// 			this.botHit()
		// 		}
		// 	}
		// },

		isBot(userId) {
			return userId > NpcId;
		},

		_enemy(enemy) {
			// this.setPairs();
		},

		createBots(proto, count, team) {
			while (count--) {
				const enemyClone = Object.assign({}, proto, { id: NpcIdCounter++, team: team, lastEnemyId: null });
				this.teams[team][enemyClone.id] = enemyClone;
				this.freeFighters[team][enemyClone.id] = null;
			}
		},

		hit(hitter, defender, type) {
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
				this.setPairs();
			} else {
				this.swap[f1.id].turn = this.selectTurn(true);
				const turnFighterId = this.swap[f1.id][!this.swap[f1.id].turn ? 'f1' : 'f2'].id;
				if (this.isBot(turnFighterId)) {
					botsHits[turnFighterId] = this.monsterDamageTime();
				}
			}
		},

		damage(user) {
			return rand(user.min_damage, user.max_damage);
		},

		stopTimer() {
			clearInterval(timer);
		},

		canSwap(f1, f2, newEnemy) {
			if (newEnemy || !--this.swap[f1.id].hits) {
				// delete this.swap[f1.id];
				// delete this.swap[f2.id];

				if (f1.curhp > 0) this.freeFighters[f1.team][f1.id] = null;
				if (f2.curhp > 0) this.freeFighters[f2.team][f2.id] = null;

				return true;
			}

			return false;
		},

		setSwap(f1, f2) {
			let isPrevEnemy = false;
			if (this.swap[f1.id]) {
				// Если существует предыдущая пара для данного бойца, проверим:
					// Если первый боец это он, а второй боец тот же что и пришел, 
					// или мы это второй боец, а первый тот кто пришел
						// то деремя дальше и меняем очередь удара на противоположный
				if ((this.swap[f1.id].f1.id === f1.id && this.swap[f1.id].f2.id === f2.id) || 
						(this.swap[f1.id].f2.id === f1.id && this.swap[f1.id].f1.id === f2.id)) {
					isPrevEnemy = true;
				}
			}
			const swap = {
				f1: { id: f1.id, team: f1.team },
				f2: { id: f2.id, team: f2.team },
				turn: this.selectTurn(isPrevEnemy ? this.swap[f1.id].id : null),
				hits: 2,
			};
			const hitter = !swap.turn ? f1 : f2;
			if (this.isBot(hitter.id)) {
				botsHits[hitter.id] = this.monsterDamageTime();
			}
			
			this.swap[f1.id] = swap;
			this.swap[f2.id] = swap;
		},

		selectTurn(prevTurn = null) {
			return !prevTurn ? !!rand(0, 1) : !prevTurn.turn;
		},

		setLog(hitter, defender, damage, hitType) {
			this.damageLog.unshift(`${hitter.login}[${hitter.level}] ударил ${defender.login}[${defender.level}] в ${hitVerbs[hitType]} на -${damage}`);
		},

		monsterDamageTime() {
			return getTimeSeconds() + rand(2, 4);
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