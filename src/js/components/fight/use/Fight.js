import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import Fighter from './Fighter';

const HIT_HEAD = 1;
const HIT_CHEST = 2;
const HIT_LEGS = 3;

const hitVerbs = {
	[HIT_HEAD]: 'голову',
	[HIT_CHEST]: 'корпус',
	[HIT_LEGS]: 'ноги',
};
let myTimerId = null;


// number means attack sprite line (how the attack must look)
export const HIT_TYPES = {
	HAND: 3,
	LEG: 7,
	EVASION: 4,
	BLOCK: 1,
	SUPER: 7,
};

function stopTimer() {
	clearInterval(myTimerId);
}

function stopAllTimers() {
	stopTimer();
}

export default class Fight {
	constructor() {
		this.store 						= useStore();
		this.userId 					= this.store.state.user.id;
		this.fighters 				= reactive({});
		this.teams 						= reactive([{}, {}]);
		this.isFightEnd 			= ref(false);
		// this.swap 						= {};
		this.winTeam 					= ref(null);
		this.hitId = 1;
		// this.user 						= null;
		// this.user 						= ref(new Fighter({}, this));
		this.user 						= reactive(new Fighter({
			lastEnemyfId: null,
			turn: null,
			damage: 0,
			fightExp: 0,
			kills: 0,
			delay: false,
			superHit: null,
			damageMe: null,
			damageEnemy: null,
		}, this));
	}

	setFighters(users) {
		Object.entries(users).forEach(([fId, u]) => {
			let fighter = new Fighter(u, this);

			if (fighter.isMe()) {
				Object.assign(this.user, fighter);
				this.user.lastEnemyfId = this.user.enemyfId;
				fighter = this.user;
			}

			this.fighters[fighter.fId] = fighter;
			this.teams[fighter.team][fighter.fId] = fighter;
		});
	}



	setLog(hitter, defender, damage, hitType, crit, block, evasion, superHit) {
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
				this.tempToggle('superHit');
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
			this.user.damageEnemy = [defenceType, damage, crit, this.hitId++];
			this.user.damageMe = [damageType, false, crit, this.hitId++];
		} else {
			this.user.damageMe = [defenceType, damage, crit, this.hitId++];
			this.user.damageEnemy = [damageType, false, crit, this.hitId++];
		}
			// this.user.damageEnemy = [defenceType, damage, crit, this.hitId++];
			// this.user.damageMe = [damageType, false, crit, this.hitId++];
		this.store.commit('ADD_FIGHT_LOG', `${hitter.login}[${hitter.level}] ${attackType} ${defender.login}[${defender.level}] ${logDamage}`);
		
		if (defender.curhp <= 0) this.store.commit('ADD_FIGHT_LOG', `${defender.login}[${defender.level}] погибает.`);
	}

	tempToggle(prop, value = true, delay = 1000) {
		this[prop] = value; setTimeout(() => { this[prop] = !value }, delay);
	}
}
