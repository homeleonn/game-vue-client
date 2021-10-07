import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import Fighter from './Fighter';
import { extra } from './fighterDamage.js';


// (fId) is a fighter id for current fight
const botProto = { fId: 0, name: 'Ящер', level: '0', curhp: '18', maxhp: '18', power: '5', critical: '5', evasion: '5', defence: '5', stamina: '5', aggr: '0', is_undead: '0', image: 'yashcher.jpg', min_damage: 1, max_damage: 2, login: 'Ящер', super_hits: {}, isBot: 1 };

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


// number means attack sprite line (how the attack must look)
export const HIT_TYPES = {
	HAND: 3,
	LEG: 7,
	EVASION: 4,
	BLOCK: 1,
	SUPER: 7,
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

function isBotHitTime(botHitTime) {
	return getTimeSeconds() >= botHitTime;
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
		// this.freeFighters 		= [{}, {}];
		this.freeFightersIds 	= [[], []];
		this.botsHits 				= {};
		this.swap 						= {};
		// this.isFightEnd 			= false;
		this.isFightEnd 			= ref(false);
		this.damageEnemy 			= null;
		this.damageMe 				= null;
		this.winTeam 					= null;
		this.fighterIdCounter = 1;
		// this.freeFighters 		= reactive([{}, {}]);
		// this.freeFightersIds 	= reactive([[], []]);
		// this.botsHits 				= reactive({});
		// this.swap 						= reactive({});


		this.initFighter(this.user, 1);
		this.createBots(botProto, 1, 0);
		// this.createBots(botProto, 1, 1);
		extra(this.user);

		for (const k in this.teams[0]) { 
			this.teams[0][k].curhp = this.teams[0][k].maxhp = 20; 
			this.teams[0][k].defence = 5; 
		}

		this.setPairs();
		this.run();
		// this.processBots();
	}

	createBots(proto, count, team) {
		if (!proto) proto = botProto;
		while (count--) {
			this.initFighter(new Fighter(Object.assign({}, proto), this), team);
		}
	}

	initFighter(f, team) {
		f.team = team;
		f.fId = this.fighterIdCounter++;
		this.addFighter(reactive(f));
		return f;
	}

	addFighter(fighter) {
		this.fighters[fighter.fId] = fighter;
		this.teams[fighter.team][fighter.fId] = fighter;
		this.addToFreeFighters(fighter);
	}

	addToFreeFighters(fighter) {
		// this.freeFighters[fighter.team][fighter.fId] = null;
		this.freeFightersIds[fighter.team].push(fighter.fId);
	}

	setPairs() {
		const activeTeam = 0;
		const passiveTeam = 1;
		const allFreeTeamFightersIds = [...this.freeFightersIds[activeTeam]];

		for (let i = 0; i < allFreeTeamFightersIds.length; i++) {
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
			fighterIdKey = this.freeFightersIds[fighter.team].indexOf(fighter.fId);
			if (fighterIdKey === -1) return;
		}
		this.freeFightersIds[fighter.team].splice(fighterIdKey, 1);
		// delete this.freeFighters[fighter.team][fighter.fId];
	}

	run() {
		fightTimerId = setInterval(() => {
			this.checkToggleTurn();
			this.processBotsTick();
		}, 2000); 
	}

	botNextTick() {
		this.processBotsTick();
	}

	processBots() {
		botTimerId = setInterval(() => {
			this.processBotsTick();
		}, 2000);
	}

	checkToggleTurn() {
		for (const fId in this.teams[0]) {
			const f = this.teams[0][fId];
			if (!f.swap || f.getTimeTurnLeft() > 1) continue;
			const passFighter = f.isHitter() ? f : f.getEnemy();
			const death = passFighter.checkTimeoutDeath();
			if (death) {
				passFighter.kill();
			}
			this.handleBot(f);
			f.toggleTurn(death);
		}
	}

	processBotsTick() {
		const botsHitsCount = Object.keys(this.botsHits).length;
		if (!botsHitsCount) return;

		for (let botId in this.botsHits) {
			if (isBotHitTime(this.botsHits[botId])) {
				delete this.botsHits[botId];
				const bot = this.fighters[botId];
				const hitter = bot.isHitter() ? bot : bot.getEnemy();

				hitter?.hit(rand(1, 3));
			}
		}
	}

	handleBot(fighter) {
		if (fighter.isBot) {
			this.botsHits[fighter.fId] = monsterDamageTime();
		}
	}

	isEnd(defender) {
		if (checkAliveTeam(this.teams[defender.team])) return false;
		
		stopAllTimers();
		this.isFightEnd.value = true;
		this.winTeam = defender.getEnemy().team;
		this.setStatistics(this.winTeam);

		return true;
	}

	setStatistics(winTeam) {
		const teamsStatisticts = [{}, {}];
		const setTeamFighterForStats = (fighter, isWinner) => {
			teamsStatisticts[fighter.team][fighter.fId] = {
				fId: fighter.fId,
				login: fighter.login,
				level: fighter.level,
				fightExp: (isWinner ? fighter.damage * 2 : 0),
				damage: fighter.damage,
				kills: fighter.kills,
			}
		}
		
		this.teams.forEach((team, idx) => {
			const isWinner = idx === winTeam;
			walkTeam(team, fighter => { setTeamFighterForStats(fighter, isWinner) });
		});

		this.store.commit('SET_FIGHTSTATS', {
			startTime,
			winTeam: this.winTeam,
			teamsStatisticts
		});
	}

	setLog(hitter, defender, damage, hitType, crit, block, evasion, superHit) {
		if (!this.isMyPair(hitter, defender)) return;
		let logDamage;
		let damageType = HIT_TYPES.HAND;
		let defenceType = false;
		let attackType = '-';
		let color = 'black';
		if (evasion) {
			defenceType = HIT_TYPES.EVASION;
			logDamage = 'уворот'
			color = 'green';
		} else if (block) {
			defenceType = HIT_TYPES.BLOCK;
			logDamage = 'блок';
			color = 'blue';
		} else {
			if (superHit) {
				this.trigger('superHit');
				damageType = HIT_TYPES.SUPER;
				attackType = 'супер-удар';
			} else {
				attackType = 'ударил';
			}

			if (crit) {
				color = 'red';
			}

			logDamage = `в ${hitVerbs[hitType]} на -<span style="color: ${color};">${damage}</span>(${defender.curhp}/${defender.maxhp})`;
		}
		if (hitter.fId === this.user.fId) {
			this.damageEnemy = [defenceType, damage, crit, this.hitId++];
			this.damageMe = [damageType, false, crit, this.hitId++];
		} else {
			this.damageMe = [defenceType, damage, crit, this.hitId++];
			this.damageEnemy = [damageType, false, crit, this.hitId++];
		}
		this.store.commit('ADD_FIGHT_LOG', `${hitter.login}[${hitter.level}] ${attackType} ${defender.login}[${defender.level}] ${logDamage}`);
		
		if (defender.curhp <= 0) this.store.commit('ADD_FIGHT_LOG', `${defender.login}[${defender.level}] погибает.`);
	}

	isMyPair(f1, f2) {
		return [f1, f2].some(f => f.fId === this.user.fId);
	}

	trigger(prop, value = true, delay = 1000) {
		this[prop] = value; setTimeout(() => { this[prop] = !value }, delay);
	}
}
