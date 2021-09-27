import { ref, reactive } from 'vue'

const HIT_TURN = 2;
const HITS_COUNT = 3;

class Fight
{
	construct() {
		this.enemy = null;
		this.init();
	}

	init() {
		this.teams 						= reactive([{}, {}]);
		this.freeFighters 		= [{}, {}];
		this.freeFightersIds 	= [[], []];
		this.botsHits 				= {};
		this.swap 						= {};
		this.isFightEnd 			= ref(false);
		this.isChangingEnemy 	= ref(false);
		this.timer 						= ref(0);
	}

	setPairs() {
		const activeTeam = 0;
		const allFreeTeamFightersIds = [...this.freeFightersIds[activeTeam]];

		for (let i = 0; i <= allFreeTeamFightersIds.length; i++) {
			if (!this.freeFightersIds[activeTeam].length || !this.freeFightersIds[1].length) return;
			const fighter = this.getRandomFighter(activeTeam);
			fighter.pullEnemy();
			this.setSwap(fighter);
		}
	}

	setSwap(f1) {
		const f2 = f1.enemy;
		const turn = f1.selectTurn();
		const swap = [f1.id, f2.id, turn, 2];
		let [hitter, defender] = setRoles(swap, f1, f2)
		this.handleBot(hitter.id);

		this.user.setMyEnemy(hitter, defender);
		
		f1.lastEnemyId = f2.id;
		f2.lastEnemyId = f1.id;

		this.swap[f1.id] = swap;
		this.swap[f2.id] = swap;
	}

	canSwap(f1, f2, newEnemy) {
		if (newEnemy || !--this.swap[f1.id][HITS_COUNT]) {
			delete this.swap[f1.id];
			delete this.swap[f2.id];

			if (f1.curhp > 0) this.freeFighters[f1.team][f1.id] = null;
			if (f2.curhp > 0) this.freeFighters[f2.team][f2.id] = null;

			return true;
		}

		return false;
	}

	isMyPair(f1, f2) {
		return f1.me || f2.me;
	}

	handleBot(fighterId) {
		if (this.isBot(fighterId)) {
			this.botsHits[fighterId] = monsterDamageTime();
		}
	}

	addFighter(fighter) {
		if (fighter.me) {
			this.user = fighter;
		}
		this.teams[fighter.team].push(fighter)
		this.freeFighters[fighter.team][fighter.id] = null;
		this.freeFightersIds[fighter.team].push(fighter);
	}

	getRandomFighter(team) {
		const fighterId = this.freeTeamFightersIds[team][rand(0, freeTeamFightersIds[team].length - 1)];
		const fighter = this.teams[team][fighterId];

		return fighter;
	}

	getEnemyTeam(team) {
		return team === 0 ? 1 : 0;
	}

	removeFreeFighter(fighter) {
		freeFightersIds.splice(fighterIdKey, 1);
		delete freeFighters[fighter.team][fighter.id];
	}
}


function monsterDamageTime() {
	// return getTimeSeconds() + rand(2, 4);
	return getTimeSeconds() + 1;
}

function setRoles(swap, f1, f2) {
	return !swap[HIT_TURN] ? [f1, f2] : [f2, f1];
}