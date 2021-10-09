import { ref } from 'vue'
let myTimerId;
let fight;
const HIT_TURN = 2;
const HITS_COUNT = 3;
const TURN_TIME = 4;
const TURN_TIME_TIMEOUT = 10 * 1000;


export default class Fighter {
	constructor(fighter, _fight) {
		fight = _fight;
		Object.assign(this, fighter);
	}

	getEnemy() {
		return fight.fighters[this.enemyfId];
	}

	setEnemy(fighter) {
		this.enemyfId 	 = fighter.fId;
		fighter.enemyfId = this.fId;
	}

	normalizeTurnTime() {
		this.swap[TURN_TIME] *= 1000;
	}

	getTimeTurnLeft() {
		return !this.swap ? null : Math.round((this.swap[TURN_TIME] - (Date.now() - TURN_TIME_TIMEOUT)) / 1000);
	}

	hit(type) {
		fight.tempToggle.call(this, 'delay');
		this.swap[HIT_TURN] = this.swap[HIT_TURN] ? 0 : 1;
	}
}

function stopTimer() {
	clearInterval(myTimerId);
}