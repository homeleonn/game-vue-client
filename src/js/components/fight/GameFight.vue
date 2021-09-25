<template>
	<div class="fight row center">
		<div class="col-md-2">
			<user-form
				:items="[]"
				:user="user"
				:info="[]"
				isFight
				:damage="damageShow"
			></user-form>
			<!-- <button @click="createBots(null, 1, 0); setPairs();">Добавить бота</button>
			<div class="fighter-list">
				<div v-for="(f, idx) in teams[0]" :key="idx">
					<user-short-info :user="f" shrink></user-short-info>
				</div>
			</div> -->
			<!-- {{user}} -->
		</div>
		<div class="col-md-4 flex fcol fight-panel">
			<div class="fighters">
				<div class="timer">{{timer}}</div>
				<img :src="'/img/locations/' + $store.state.location.image">
				<fighter-model side="left" :damage="damageMe" :key="1"></fighter-model>
				<fighter-model side="right" :damage="damageEnemy" :key="2" class="enemy-fighter" :class="{change: isChangingEnemy}"></fighter-model>
			</div>
			<div v-if="turn && !isChangingEnemy">
				<div><button @click="hit(user, enemy, HIT_HEAD)">В голову</button></div>
				<div><button @click="hit(user, enemy, HIT_CHEST)">В корпус</button></div>
				<div><button @click="hit(user, enemy, HIT_LEGS)">В ноги</button></div>
			</div>
			<div v-else-if="enemy">
				<h3>Ход противника...</h3>
			</div>
			<!-- {{freeFighters}} -->
			<div v-if="isFightEnd">
				<b>Fight has finished!</b>
				<button @click="$emit('setCurComp', 'FightStats')">Statistics</button>
			</div>
			<!-- {{botsHits}} -->
			<!-- <div v-for="(s, idx) in swap" :key="idx">{{idx}}: {{s}}</div> -->
			<div><button @click="reset">Reset</button></div>
			<!-- <div><button @click="processBotsTick">NextTick</button></div> -->
			<div><button @click="stopAllTimers()">Stop timers</button></div>
			<!-- <div v-for="log in damageLog" :key="log" v-html="log"></div> -->
		</div>
		<div class="col-md-2 center">
			<div v-if="enemy">
				<!-- <div class="changing-enemy icon-spin3 active"></div> -->
				<div v-if="isChangingEnemy" class="changing-enemy icon-spin3 active"></div>
				<user-form v-else
					:items="[]"
					:user="enemy"
					:info="[]"
					isFight
				></user-form>
			</div>
			<div v-else>
				<h3>Ожидание противника...</h3>
			</div>
		</div>
		<div class="col-md-4">
			<div class="teams row">
				<div class="col-md-6">
					<div class="fighter-list">
						<div v-for="(f, idx) in teams[0]" :key="idx">
							<div :class="{'active': enemy?.id == f.id}">
								<user-short-info :user="f" shrink></user-short-info>
							</div>
						</div>
					</div>
					<button @click="createBots(null, 1, 0); setPairs();">Добавить бота</button>
				</div>
				<div class="col-md-6">
					<div class="fighter-list">
						<div v-for="(f, idx) in teams[1]" :key="idx">
							<div :class="{'active': enemy?.id == f.id}">
								<user-short-info :user="f" shrink></user-short-info>
							</div>
						</div>
					</div>
					<button @click="createBots(null, 1, 1); setPairs();">Добавить бота</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import UserForm from '../user/form/UserForm'
import UserShortInfo from '../user/form/UserShortInfo'
import FighterModel from './FighterModel'
// import FighterModel1 from './FighterModel'
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
let botTimerId = null;
let myTimerId = null;
let startTime = new Date().getTime();


export default {
	data() {
		return {
			teams: [
				{}, {}
			],
			enemy: null,
			isChangingEnemy: false,
			botsHits: {},
			swap: {},
			isFightEnd: false,
			turn: null,
			timer: null,
			hitId: 1,
			damageMe: [],
			damageEnemy: [],
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

		HIT_HEAD: () => HIT_HEAD,
		HIT_CHEST: () => HIT_CHEST,
		HIT_LEGS: () => HIT_LEGS,
	},

	mounted() {
		// this.api.doAction('getEnemy', 1);
		// this._enemy(enemyProto);
		// setInterval(() => { this.damageTest = rand(1, 100) }, 1000)
		this.reset();
	},

	methods: {
		reset() {
			this.$store.commit('CLEAR_FIGHT_LOG');
			this.stopTimer();
			this.stopBotTimer();
			this.isFightEnd = false;
			this.botsHits = {};
			this.swap = {};
			this.teams = [{}, {}];
			this.freeFighters = [{}, {}];
			this.user.min_damage = 5;
			this.user.max_damage = 10;
			this.initFighter(this.user, 0);
			this.createBots(botProto, 0, 0);
			this.createBots(botProto, 3, 1);
			this.user.curhp = 400;
			this.setPairs();
			// for (const k in this.teams[1]) { this.teams[1][k].curhp = 1; }

			this.processBots();
		},
		

		setPairs() {
			const freeTeamFightersIds = [[], []];
			const shiftRandFighter = (team, freeTeamFightersIds) => {
				const fighterIdKey = rand(0, freeTeamFightersIds.length - 1);
				const fighterId = freeTeamFightersIds[fighterIdKey];
				freeTeamFightersIds.splice(fighterIdKey, 1);

				return this.teams[team][fighterId];
			}

			const getFreeTeamFightersIds = team => {
				const ids = Object.keys(this.freeFighters[team]);
				return ids.length ? ids : false;
			}

			const allFreeTeamFightersIds = getFreeTeamFightersIds(0);
			if (!allFreeTeamFightersIds) return;
			freeTeamFightersIds[0] = [...allFreeTeamFightersIds];
			freeTeamFightersIds[1] = getFreeTeamFightersIds(1);
			// if (!freeTeamFightersIds[0] || !freeTeamFightersIds[1]) return;

			for (let i = 0; i <= allFreeTeamFightersIds.length; i++) {
				if (!freeTeamFightersIds[0].length || !freeTeamFightersIds[1].length) return;
				const fighter1 = shiftRandFighter(0, freeTeamFightersIds[0]); // Take a fighter from first team free fighters
				const fighter2 = shiftRandFighter(1, freeTeamFightersIds[1]); // Select opponent from second free fighters
				delete this.freeFighters[fighter1.team][+fighter1.id]; // remove fighter 1 from free
				delete this.freeFighters[fighter2.team][+fighter2.id]; // remove fighter 2 from free
				this.setSwap(fighter1, fighter2);
			}
		},

		createBots(proto, count, team) {
			if (!proto) proto = botProto;
			while (count--) {
				const enemyClone = this.initFighter(Object.assign({}, proto, { id: NpcIdCounter++ }), team);
			}
		},

		initFighter(f, team) {
			f.team = team;
			f.lastEnemyId = null;
			f.turn = null;
			f.damage = 0;
			f.fightExp = 0;
			f.kills = 0;
			this.teams[team][f.id] = f;
			this.freeFighters[team][f.id] = null;

			return f;
		},



		processBots() {
			botTimerId = setInterval(() => {
				this.processBotsTick();
			}, 2000);
		},

		processBotsTick() {
			if (!Object.keys(this.botsHits).length) return;
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
			let [damage, crit] = this.damage(hitter, defender);
			defender.curhp -= damage;
			this.removeMyTurn(hitter.id);
			this.setLog(hitter, defender, damage, type, crit);
			const isFighterDeath = this.checkFighterDeath(hitter, defender);
			this.toggleTurn(hitter, defender, isFighterDeath);
		},

		damage(hitter, defender) {
			let damage = rand(hitter.min_damage, hitter.max_damage);
			const crit = this.isCrit();

			if (crit) {
				damage *= 2;
			}

			if (defender.curhp < damage) {
				damage = +defender.curhp;
			}

			hitter.damage += damage;

			return [damage, crit];
		},

		isCrit() {
			return !!rand(0, 1)
		},

		checkFighterDeath(hitter, defender) {
			if (defender.curhp <= 0) {
				hitter.kills += 1;
				defender.curhp = 0;
				delete this.freeFighters[defender.team][defender.id];
				this.checkEndFight(defender);
				return true;
			}

			return false;
		},

		checkEndFight(defender) {
			this.isFightEnd = !this.checkAliveTeam(this.teams[defender.team]);
			const winTeam = defender.team === 0 ? 1 : 0;

			if (this.isFightEnd) {
				this.stopAllTimers();

				const teams = [{}, {}];
				const setTeamFighterForStats = (fighter, winner) => {
					teams[fighter.team][fighter.id] = {
						id: fighter.id,
						login: fighter.login,
						level: fighter.level,
						fightExp: (winner ? fighter.damage * 2 : 0),
						damage: fighter.damage,
						kills: fighter.kills,
					}
				}
				walkTeam(this.teams[winTeam], fighter => { setTeamFighterForStats(fighter, true) });
				walkTeam(this.teams[defender.team], fighter => { setTeamFighterForStats(fighter, false) });

				this.$store.commit('SET_FIGHTSTATS', {
					startTime,
					winTeam,
					teams
				});
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

		toggleTurn(f1, f2, isFighterDeath = false) {
			if (this.isFightEnd) return;
			if (this.canSwap(f1, f2, isFighterDeath)) {
				if (f1.id === this.user.id || f2.id === this.user.id) {
					this.enemy = null;
				}
				this.setPairs();
			} else {
				this.swap[f1.id][HIT_TURN] = selectTurn(f1, f2);
				const turnFighterTeam = this.swap[f1.id][HIT_TURN] ? 1 : 0;
				const turnFighterId = this.swap[f1.id][turnFighterTeam];
				this.setMyTurn(f1, f2, turnFighterId);
				if (this.isBot(turnFighterId)) {
					this.botsHits[turnFighterId] = monsterDamageTime(); // todo: in method
				}
			}
		},

		setMyTurn(f1, f2, turnFighterId) {
			if (turnFighterId === this.user.id) {
				this.turn = true;
				this.timer = 10;
				myTimerId = setInterval(() => {
					this.timer--;
					if (!this.timer) {
						this.removeMyTurn(this.user.id);
						this.toggleTurn(f1, f2);
					}
				}, 1000);
			}
		},

		removeMyTurn(turnFighterId) {
			if (turnFighterId === this.user.id) {
				this.turn = this.timer = null;
				this.stopTimer();
			}
		},

		stopTimer() {
			clearInterval(myTimerId);
		},

		stopBotTimer() {
			clearInterval(botTimerId);
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
			// if (f1.id === this.user.id || f2.id === this.user.id) {
			// 	cl(11111);
			// }
			const turn = selectTurn(f1, f2);
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
				this.botsHits[hitter.id] = monsterDamageTime();
			}

			if (hitter.id === this.user.id) {
				this.enemy = defender;
				this.setMyTurn(hitter, defender, hitter.id);
			} else if (defender.id === this.user.id) {
				this.enemy = hitter;
			}

			if (this.enemy && this.user.lastEnemyId !== this.enemy.id) {
				this.isChangingEnemy = true;
				setTimeout(() => {
					this.isChangingEnemy = false;
				}, 1000)
			}
			
			f1.lastEnemyId = f2.id;
			f2.lastEnemyId = f1.id;

			this.swap[f1.id] = swap;
			this.swap[f2.id] = swap;
		},

		setLog(hitter, defender, damage, hitType, crit = false) {
			if (!this.isMe(hitter, defender)) return;
			const d = crit ? `<span style="color: red;">${damage}</span>` : damage;
			if (hitter.id === this.user.id) {
				// cl(1);
				this.damageEnemy = [false, damage, crit, this.hitId++];
				this.damageMe = [3, false, crit, this.hitId++];
			} else {
				this.damageMe = [false, damage, crit, this.hitId++];
				this.damageEnemy = [3, false, crit, this.hitId++];
			}
			// this.['damage' + (hitter === this.user.id ? 'Enemy' : 'Me')] = [3, damage, crit, this.hitId++];
			this.$store.commit('ADD_FIGHT_LOG', `${hitter.login}[${hitter.level}] ударил ${defender.login}[${defender.level}] в ${hitVerbs[hitType]} на -${d}(${defender.curhp}/${defender.maxhp})`);
			if (defender.curhp <= 0) {
				this.$store.commit('ADD_FIGHT_LOG', `${defender.login}[${defender.level}] погибает.`);
			}
		},

		isMe(hitter, defender) {
			return hitter.id === this.user.id || defender.id === this.user.id;
		}

		
	},

	components: {
		UserForm,
		UserShortInfo,
		FighterModel,
		// FighterModel1
	}
}

function monsterDamageTime() {
	// return getTimeSeconds() + rand(2, 4);
	return getTimeSeconds() + 1;
}

function selectTurn(f1, f2) {
	const isPrevEnemy = f1.lastEnemyId === f2.id;
	const turn = !isPrevEnemy ? rand(0, 1) : (f1.turn ? 0 : 1);
	f1.turn = f2.turn = turn;

	return turn;
}

function walkTeam(team, cb) {
	for (const fId in team) {
		cb(team[fId]);
	}
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

	.changing-enemy {
		animation: spin 2s linear infinite;
		margin: 0 auto;
		margin-top: 20px;

		&:before {
			display: inline-block;
			font-size: 200px;
		}
	}

	.fighters {
		position: relative;
		overflow: hidden;
		padding: 50px;

		.fighter {
			margin-left: 30px;
		}

		img {
			margin-left: -20px;
			position: absolute;
			top: -180%;
			left: -100%;
			width: 300%;
		}

		.timer {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			font-size: 30px;
			font-weight: bold;
			color: white;
			z-index: 999;
		}
	}

	.enemy-fighter {
		transition: left .2s;
	}

	.change {
		left: 500px;
	}
}
</style>