import { ref } from 'vue'
let myTimerId;
let fight;
const HIT_TURN = 2;
const HITS_COUNT = 3;
const TURN_TIME = 4;
const TURN_TIME_TIMEOUT = 10;


export default class Fighter {
	constructor(fighter, _fight) {
		fight = _fight;
		Object.assign(this, fighter);
	}

	getEnemy() {
		return this.swap && fight.fighters[this.enemyfId];
	}

	setEnemy(fighter) {
		this.enemyfId 	 = fighter.fId;
		fighter.enemyfId = this.fId;
	}

	clearEnemy() {
		return setTimeout(() => {
			this.enemyfId = null;
			this.swap = null;
			this.lastEnemyfId = null;
		}, 1000);
	}

	getTimeTurnLeft() {
		return !this.swap ? null : Math.round((this.swap[TURN_TIME] - (Date.now() / 1000 - TURN_TIME_TIMEOUT)));
	}

	hit(type) {
		fight.tempToggle.call(this, 'delay');
		// this.swap[HIT_TURN] = this.swap[HIT_TURN] ? 0 : 1;
	}

	isBot() {
		return typeof this.aggr != "undefined";
	}

	isMe() {
		return !this.isBot() && this.id == fight.userId;
	}

	// isMyPair() {
	// 	return this.isMe() || this.getEnemy()?.isMe();
	// }

	shiftHit() {
		this.swap[HITS_COUNT]--;
	}

	hitsExist() {
		return this.swap[HITS_COUNT] ?? null;
	}

	swapTick() {
		this.swap[HITS_COUNT]--;
		this.swap[HIT_TURN] = this.swap[HIT_TURN] ? 0 : 1;
		this.swap[TURN_TIME] = Date.now() / 1000;
	}
}

function stopTimer() {
	clearInterval(myTimerId);
}