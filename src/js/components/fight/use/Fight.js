
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import Fighter from './Fighter';

const botProto = { id: 1, name: 'Ящер', level: '0', curhp: '18', maxhp: '18', power: '5', critical: '5', evasion: '0', stamina: '4', aggr: '0', is_undead: '0', image: 'yashcher.jpg', min_damage: 1, max_damage: 2, login: 'Ящер' };

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

const FIGTER_TEAM_0 = 0;
const FIGTER_TEAM_1 = 1;
const HIT_TURN = 2;
const HITS_COUNT = 3;
let botTimerId = null;
let myTimerId = null;
let startTime = new Date().getTime();


function checkAliveTeam(team) {
	for (const fId in team) {
		if (team[fId].curhp > 0) {
			return true;
		}
	}

	return false;
}


function monsterDamageTime() {
	// return getTimeSeconds() + rand(2, 4);
	return getTimeSeconds() + 1;
}

function setRoles(swap, f1, f2) {
	return !swap[HIT_TURN] ? [f1, f2] : [f2, f1];
}

function isBotHitTime(botHitTime) {
	return getTimeSeconds() >= botHitTime;
}


function isBot(userId) {
	return userId >= NpcId;
}

function walkTeam(team, cb) {
	for (const fId in team) {
		cb(team[fId]);
	}
}

function stopTimer() {
	clearInterval(myTimerId);
}

function stopBotTimer() {
	clearInterval(botTimerId);
}

function stopAllTimers() {
	stopTimer();
	stopBotTimer();
}

export default class Fight {
	constructor() {
		this.store = useStore();
		this.init();
	}

	init() {
		// cl(this.store.state.user);
		cl(111);
		this.store.state.user = this.store.state.user instanceof Fighter ? this.store.state.user : new Fighter(this.store.state.user, this, true);
		stopAllTimers();
		this.user							= this.store.state.user;
		cl(this.teams)
		this.teams 						= reactive([{}, {}]);
		cl(this.teams)
		this.freeFighters 		= reactive([{}, {}]);
		this.freeFightersIds 	= reactive([[], []]);
		this.botsHits 				= reactive({});
		this.swap 						= reactive({});
		this.isFightEnd 			= ref(false);
		this.isChangingEnemy 	= ref(false);
		this.timer 						= ref(0);

		this.initFighter(this.user, 1);
		this.createBots(botProto, 2, 0);
		this.createBots(botProto, 1, 1);

		this.setPairs();
		this.processBots();
	}

	createBots(proto, count, team) {
		if (!proto) proto = botProto;
		while (count--) {
			this.initFighter(new Fighter(Object.assign({}, proto, { id: NpcIdCounter++ }), this), team);
		}
	}

	initFighter(f, team) {
		f.team = team;
		f.lastEnemyId = null;
		f.turn = null;
		f.damage = 0;
		f.fightExp = 0;
		f.kills = 0;

		this.addFighter(f);

		return f;
	}

	addFighter(fighter) {
		this.teams[fighter.team][fighter.id] = fighter;
		this.addToFreeFighters(fighter);
	}

	addToFreeFighters(fighter) {
		this.freeFighters[fighter.team][fighter.id] = null;
		this.freeFightersIds[fighter.team].push(fighter.id);
	}

	setPairs() {
		const activeTeam = 0;
		const allFreeTeamFightersIds = [...this.freeFightersIds[activeTeam]];

		for (let i = 0; i <= allFreeTeamFightersIds.length; i++) {
			if (!this.freeFightersIds[activeTeam].length || !this.freeFightersIds[1].length) return;
			const fighter = this.getRandomFighter(activeTeam);
			fighter.pullEnemy();
		}
	}

	isMyPair(f1, f2) {
		return this.user.id === f1.id || this.user.id === f2.id;
	}

	toggleTurn(f1, f2, isFighterDeath = false) {
		if (this.isFightEnd.value) return;
		if (this.canSwap(f1, f2, isFighterDeath)) {
			if (this.isMyPair(f1, f2)) {
				this.user.enemy = null;
			}
			this.setPairs();
		} else {
			const [turn, hitter, defender] = f1.selectTurn(f1, f2);
			this.swap[f1.id][HIT_TURN] = turn;
			this.user.setMyTurn(f1, f2, this.user.isMe(hitter.id));
			this.handleBot(hitter.id);
		}
	}

	canSwap(f1, f2, newEnemy) {
		if (newEnemy || !--this.swap[f1.id][HITS_COUNT]) {
			delete this.swap[f1.id];
			delete this.swap[f2.id];
			// cl(111);
			if (f1.curhp > 0) this.addToFreeFighters(f1);
			if (f2.curhp > 0) this.addToFreeFighters(f2);
		

			return true;
		}

		return false;
	}

	processBots() {
		botTimerId = setInterval(() => {
			this.processBotsTick();
		}, 2000);
	}

	processBotsTick() {
		const botsHitsCount = Object.keys(this.botsHits).length;
		cl('Next bot hit', botsHitsCount);
		if (!botsHitsCount) return;

		for (let botId in this.botsHits) {
			if (isBotHitTime(this.botsHits[botId])) {
				delete this.botsHits[botId];
				let hitterTeam, defenderTeam;
				if (this.swap[botId][0] === +botId) {
					hitterTeam = 0;
					defenderTeam = 1;
				} else {
					hitterTeam = 1;
					defenderTeam = 0;
				}

				const hitter = this.teams[hitterTeam][this.swap[botId][hitterTeam]];
				// defender = this.teams[defenderTeam][this.swap[botId][defenderTeam]];

				hitter.hit(rand(1, 3));
			}
		}
	}

	handleBot(fighterId) {
		cl(fighterId);
		if (isBot(fighterId)) {
			this.botsHits[fighterId] = monsterDamageTime();
		}
	}

	getRandomFighter(team) {
		const fighterId = this.freeFightersIds[team][rand(0, this.freeFightersIds[team].length - 1)];
		const fighter = this.teams[team][fighterId];

		return fighter;
	}

	getEnemyTeam(team) {
		return team === 0 ? 1 : 0;
	}

	removeFreeFighter(fighterIdKey, fighter) {
		this.freeFightersIds[fighter.team].splice(fighterIdKey, 1);
		delete this.freeFighters[fighter.team][fighter.id];
	}

	checkEndFight(defender) {
		this.isFightEnd = !checkAliveTeam(this.teams[defender.team]);
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
	}
}
