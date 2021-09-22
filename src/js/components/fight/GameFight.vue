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
			{{botsHits}}
			<div v-for="(s, idx) in swap" :key="idx">{{idx}}: {{s}}</div>
			<div><button @click="reset">Reset</button></div>
			<div><button @click="processBotsTick">NextTick</button></div>
			<div v-if="turn">
				<div><button @click="hit(user, enemy, HIT_HEAD)">В голову</button></div>
				<div><button @click="hit(user, enemy, HIT_CHEST)">В корпус</button></div>
				<div><button @click="hit(user, enemy, HIT_LEGS)">В ноги</button></div>
			</div>
			<div v-else-if="enemy">
				<h3>Ход противника...</h3>
			</div>
			{{freeFighters}}
			<div>{{timer}}</div>
			<div v-for="log in damageLog" :key="log" v-html="log"></div>
		</div>
		<div class="col-md-4 center">
			<user-form v-if="enemy"
				:items="[]"
				:user="enemy"
				:info="[]"
				isFight
			></user-form>
			<div v-else>
				<h3>Ожидание противника...</h3>
			</div>
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

const botProto = { id: 1, name: 'Ящер', level: '0', curhp: '18', maxhp: '18', power: '5', critical: '5', evasion: '0', stamina: '4', aggr: '0', is_undead: '0', image: 'yashcher.jpg', min_damage: 2, max_damage: 8, login: 'Ящер' }
const HIT_HEAD = 1;
const HIT_CHEST = 2;
const HIT_LEGS = 3;

const hitVerbs = {
	[HIT_HEAD]: 'голову',
	[HIT_CHEST]: 'корпус',
	[HIT_LEGS]: 'ноги',
};
let mdt = null;
const NpcId = 1e2;
let NpcIdCounter = NpcId;
const secondsForHit = 20
// let botsHits = {};

const FIGTER_TEAM_0 = 0;
const FIGTER_TEAM_1 = 1;
const HIT_TURN = 2;
const HITS_COUNT = 3;
let botTimer = null;

export default {
	data() {
		return {
			teams: [
				{}, {}
			],
			enemy: null,
			botsHits: {},
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
			const bot = botProto;
			this.stopTimer();
			this.stopBotTimer();
			this.isFightEnd = false;
			this.botsHits = {};
			this.swap = {};
			this.teams = [{}, {}];
			this.freeFighters = [{}, {}];
			this.damageLog = [];
			// this.user.max_damage = 20;
			this.initFighter(this.user, 0);
			// this.createBots(bot, 2, 0);
			this.createBots(bot, 2, 1);
			this.user.curhp = 100;
			this.setPairs();
			// for (const k in this.teams[1]) { this.teams[1][k].curhp = 1; }

			this.processBots();
		},
		

		setPairs() {
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
				// if (fighter1.id === this.user.id) this.enemy = fighter2; // set my enemy
				// else if (fighter2.id === this.user.id) this.enemy = fighter1; // set my enemy
				delete this.freeFighters[fighter1.team][fighter1.id]; // remove fighter 1 from free
				delete this.freeFighters[fighter2.team][fighter2.id]; // remove fighter 2 from free
				this.setSwap(fighter1, fighter2);
			}
		},

		createBots(proto, count, team) {
			while (count--) {
				const enemyClone = this.initFighter(Object.assign({}, proto, { id: NpcIdCounter++ }), team);
			}
		},

		initFighter(f, team) {
			f.team = team;
			f.lastEnemyId = null;
			f.turn = null;
			this.teams[team][f.id] = f;
			this.freeFighters[team][f.id] = null;

			return f;
		},



		processBots() {
			botTimer = setInterval(() => {
				this.processBotsTick();
			}, 2000);
		},

		processBotsTick() {
			cl('Next bot hit');
			let hitterTeam, defenderTeam, hitter, defender;
			for (let botId in this.botsHits) {
				if (this.isBotHitTime(this.botsHits[botId])) {
					delete this.botsHits[botId];
					if (this.swap[botId][FIGTER_TEAM_0] === +botId) {
						hitterTeam = FIGTER_TEAM_0;
						defenderTeam = FIGTER_TEAM_1;
					} else {
						hitterTeam = FIGTER_TEAM_1;
						defenderTeam = FIGTER_TEAM_0;
					}

					hitter = this.teams[hitterTeam][this.swap[botId][hitterTeam]];
					defender = this.teams[defenderTeam][this.swap[botId][defenderTeam]];

					this.hit(hitter, defender, rand(1, 3));
				}
			}
		},

		isBotHitTime(botHitTime) {
			return getTimeSeconds() >= botHitTime;
		},


		isBot(userId) {
			return userId >= NpcId;
		},

		_enemy(enemy) {
			// this.setPairs();
		},

		hit(hitter, defender, type) {
			if (hitter.id === this.user.id) this.turn = null;
			let [damage, crit] = this.damage(hitter);
			if (crit) {
				damage *= 2;
			}
			if (defender.curhp < damage) {
				damage = defender.curhp;
			}
			defender.curhp -= damage;
			this.setLog(hitter, defender, damage, type, crit);
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
				this.stopAllTimers();
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
				if (f1.id === this.user.id || f2.id === this.user.id) {
					this.enemy = null;
				}
				this.setPairs();
			} else {
				this.swap[f1.id][HIT_TURN] = this.selectTurn(f1, f2);
				const turnFighterTeam = this.swap[f1.id][HIT_TURN] ? 1 : 0;
				const turnFighterId = this.swap[f1.id][turnFighterTeam];
				if (turnFighterId === this.user.id) {
					this.turn = true;
				}
				if (this.isBot(turnFighterId)) {
					this.botsHits[turnFighterId] = this.monsterDamageTime();
				}
			}
		},

		damage(user) {
			return [rand(user.min_damage, user.max_damage), !!rand(0, 1)];
		},

		stopTimer() {
			clearInterval(this.timer);
		},

		stopBotTimer() {
			clearInterval(botTimer);
		},

		stopAllTimers() {
			this.stopTimer();
			this.stopBotTimer();
		},

		canSwap(f1, f2, newEnemy) {
			if (newEnemy || !--this.swap[f1.id][HITS_COUNT]) {
				delete this.swap[f1.id];
				delete this.swap[f2.id];

				if (f1.curhp > 0) this.freeFighters[f1.team][f1.id] = null;
				if (f2.curhp > 0) this.freeFighters[f2.team][f2.id] = null;

				return true;
			}

			return false;
		},

		setSwap(f1, f2) {
			const turn = this.selectTurn(f1, f2);
			const swap = [
				f1.id,
				f2.id,
				turn,
				2,
			];

			let hitter, defender;
			if (!swap[HIT_TURN]) {
				hitter = f1;
				defender = f2;
			} else {
				hitter = f2;
				defender = f1;
			}

			// Set user enemy
			if (this.isBot(hitter.id)) {
				this.botsHits[hitter.id] = this.monsterDamageTime();
			}

			if (hitter.id === this.user.id) {
				this.enemy = defender;
				this.turn = true;
			} else if (defender.id === this.user.id) {
				this.enemy = hitter;
			}
			
			f1.lastEnemyId = f2.id;
			f2.lastEnemyId = f1.id;

			this.swap[f1.id] = swap;
			this.swap[f2.id] = swap;
		},

		findPreviousEnemy(f1, f2) {
			let prevEnemy = null;
			if (this.swap[f1.id][FIGTER_TEAM_0] === f1.id) {
				prevEnemy = this.swap[f1.id][FIGTER_TEAM_1];
			} else if (this.swap[f1.id][FIGTER_TEAM_1] === f1.id) {
				prevEnemy = this.swap[f1.id][FIGTER_TEAM_0];
			}

			return prevEnemy
		},

		selectTurn(f1, f2) {
			const isPrevEnemy = f1.lastEnemyId === f2.id;
			const turn = !isPrevEnemy ? rand(0, 1) : (f1.turn ? 0 : 1);
			f1.turn = f2.turn = turn;

			return turn;
		},

		setLog(hitter, defender, damage, hitType, crit = false) {
			damage = crit ? `<span style="color: red;">${damage}</span>` : damage;
			this.damageLog.unshift(`${hitter.login}[${hitter.level}] ударил ${defender.login}[${defender.level}] в ${hitVerbs[hitType]} на -${damage}`);
		},

		monsterDamageTime() {
			// return getTimeSeconds() + rand(2, 4);
			return getTimeSeconds() + 1;
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