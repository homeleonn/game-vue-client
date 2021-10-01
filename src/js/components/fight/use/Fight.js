
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import Fighter from './Fighter';

const botProto = { id: 1, name: 'Ящер', level: '0', curhp: '18', maxhp: '18', power: '5', critical: '5', evasion: '5', defence: '5', stamina: '5', aggr: '0', is_undead: '0', image: 'yashcher.jpg', min_damage: 1, max_damage: 2, login: 'Ящер' };

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
let fightTimerId = null;
let startTime = new Date().getTime();
const HIT_TYPES = {
	HAND: 3,
	LEG: 7,
	EVASION: 4,
	EVASION1: 2,
	BLOCK: 1,
};


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

function stopFightTimer() {
	clearInterval(fightTimerId);
}

function stopBotTimer() {
	clearInterval(botTimerId);
}

function stopAllTimers() {
	stopTimer();
	stopBotTimer();
	stopFightTimer();
}

export default class Fight {
	constructor() {
		this.store = useStore();
		this.init();
	}

	init() {
		stopAllTimers();
		this.store.state.user = this.store.state.user instanceof Fighter ? this.store.state.user : new Fighter(this.store.state.user, this, true);
		this.user							= this.store.state.user;
		// this.user.e 					= reactive(null);
		this.fighters 				= {};
		this.teams 						= reactive([{}, {}]);
		this.freeFighters 		= [{}, {}];
		this.freeFightersIds 	= [[], []];
		this.botsHits 				= {};
		this.swap 						= {};
		// this.isFightEnd 			= false;
		this.isFightEnd 			= ref(false);
		this.damageEnemy 			= null;
		this.damageMe 				= null;
		this.winTeam 					= null;
		// this.freeFighters 		= reactive([{}, {}]);
		// this.freeFightersIds 	= reactive([[], []]);
		// this.botsHits 				= reactive({});
		// this.swap 						= reactive({});

		this.initFighter(this.user, 1);
		this.createBots(botProto, 1, 0);
		// this.createBots(botProto, 1, 1);
		this.user.curhp = this.user.maxhp = 400;
		this.user.critical = 5;
		this.user.evasion = 200;
		for (const k in this.teams[0]) { 
			this.teams[0][k].curhp = this.teams[0][k].maxhp = 100; 
			this.teams[0][k].defence = 200; 
		}

		this.setPairs();
		this.run();
		// this.processBots();
	}

	createBots(proto, count, team) {
		if (!proto) proto = botProto;
		while (count--) {
			this.initFighter(new Fighter(Object.assign({}, proto, { id: NpcIdCounter++ }), this), team);
		}
	}

	initFighter(f, team) {
		f.team = team;
		this.addFighter(reactive(f));
		return f;
	}

	addFighter(fighter) {
		this.fighters[fighter.id] = fighter;
		this.teams[fighter.team][fighter.id] = fighter;
		this.addToFreeFighters(fighter);
	}

	addToFreeFighters(fighter) {
		this.freeFighters[fighter.team][fighter.id] = null;
		this.freeFightersIds[fighter.team].push(fighter.id);
	}

	setPairs() {
		const activeTeam = 0;
		const passiveTeam = 1;
		const allFreeTeamFightersIds = [...this.freeFightersIds[activeTeam]];

		for (let i = 0; i <= allFreeTeamFightersIds.length; i++) {
			if (!this.freeFightersIds[activeTeam].length || !this.freeFightersIds[passiveTeam].length) return;
			const fighter = this.getRandomFighter(activeTeam);
			fighter.setEnemy(this.getRandomFighter(passiveTeam));
			fighter.setSwap();
		}
	}

	getRandomFighter(team) {
		const fighterIdKey = rand(0, this.freeFightersIds[team].length - 1);
		const fighterId = this.freeFightersIds[team][fighterIdKey];
		const fighter = this.teams[team][fighterId];

		this.removeFreeFighter(fighter, fighterIdKey);

		return fighter;
	}

	removeFreeFighter(fighter, fighterIdKey = null) {
		if (fighterIdKey === null) {
			fighterIdKey = this.freeFightersIds[fighter.team].indexOf(fighter.id);
			if (fighterIdKey === -1) return;
		}
		this.freeFightersIds[fighter.team].splice(fighterIdKey, 1);
		delete this.freeFighters[fighter.team][fighter.id];
	}

	run() {
		fightTimerId = setInterval(() => {
			this.checkToggleTurn();
			this.processBotsTick();
		}, 2000); 
	}

	checkToggleTurn() {
		for (const fId in this.teams[0]) {
			const f = this.teams[0][fId];
			if (!f.swap || f.getTimeTurnLeft() > 1) continue;
			cl(f.isHitter());
			const passFighter = f.isHitter() ? f : f.getEnemy();
			const death = passFighter.checkFighterTimeoutDeath();
			if (death) {
				passFighter.kill();
			}
			this.handleBot(f.id);
			f.toggleTurn(death);
		}
	}

	botNextTick() {
		this.processBotsTick();
	}

	processBots() {
		botTimerId = setInterval(() => {
			this.processBotsTick();
		}, 2000);
	}

	processBotsTick() {
		const botsHitsCount = Object.keys(this.botsHits).length;
		if (!botsHitsCount) return;

		for (let botId in this.botsHits) {
			if (isBotHitTime(this.botsHits[botId])) {
				delete this.botsHits[botId];
				const bot = this.fighters[botId];
				const hitter = bot.isHitter() ? bot : bot.getEnemy();

				hitter.hit(rand(1, 3));
			}
		}
	}

	handleBot(fighterId) {
		if (isBot(fighterId)) {
			this.botsHits[fighterId] = monsterDamageTime();
		}
	}

	checkEndFight(defender) {
		this.isFightEnd.value = !checkAliveTeam(this.teams[defender.team]);
		const winTeam = this.winTeam = defender.getEnemy().team;

		if (this.isFightEnd.value) {
			stopAllTimers();

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

			this.store.commit('SET_FIGHTSTATS', {
				startTime,
				winTeam,
				teams
			});
		}

		return this.isFightEnd;
	}

	setLog(hitter, defender, damage, hitType, crit = false, block = false, evasion = false) {
		if (!this.isMyPair(hitter, defender)) return;
		const d = crit ? `<span style="color: red;">${damage}</span>` : damage;
		const defenceType = evasion ? HIT_TYPES.EVASION : (block ? HIT_TYPES.BLOCK : false);
		if (hitter.id === this.user.id) {
			// cl(1);
			this.damageEnemy = [defenceType, damage, crit, this.hitId++];
			this.damageMe = [3, false, crit, this.hitId++];
		} else {
			this.damageMe = [defenceType, damage, crit, this.hitId++];
			this.damageEnemy = [3, false, crit, this.hitId++];
		}
		// this.['damage' + (hitter === this.user.id ? 'Enemy' : 'Me')] = [3, damage, crit, this.hitId++];
		this.store.commit('ADD_FIGHT_LOG', `${hitter.login}[${hitter.level}] ударил ${defender.login}[${defender.level}] в ${hitVerbs[hitType]} на -${d}(${defender.curhp}/${defender.maxhp})`);
		if (defender.curhp <= 0) {
			this.store.commit('ADD_FIGHT_LOG', `${defender.login}[${defender.level}] погибает.`);
		}
	}

	isMyPair(f1, f2) {
		return [f1, f2].some(f => f.id === this.user.id);
	}
}
