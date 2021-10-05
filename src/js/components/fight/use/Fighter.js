import { ref } from 'vue'
import { checkAttack } from './damageCalculate.js'
import { checkSuperHit } from './fighterDamage.js'
let myTimerId;
let fight;
const TURN_TIME = 4;
const TURN_TIME_TIMEOUT = 10 * 1000;
const FIGTER_TEAM_0 = 0;
const FIGTER_TEAM_1 = 1;
const HIT_TURN = 2;
const HITS_COUNT = 3;

export default class Fighter {
	constructor(fighter, _fight) {
		fight = _fight;
		Object.assign(this, fighter, {
			lastEnemyId: null,
			turn: null,
			damage: 0,
			fightExp: 0,
			kills: 0,
			delay: false,
			timeoutTicks: 0,
			swap: null
		});
	}

	getEnemy() {
		return fight.fighters[this.e];
	}

	setEnemy(fighter) {
		this.e 		= fighter.fId;
		fighter.e = this.fId;
	}

	getTimeTurnLeft() {
		return !this.swap ? null : Math.round((this.swap[TURN_TIME] - (Date.now() - TURN_TIME_TIMEOUT)) / 1000);
	}

	hit(type) {
		doAction('beforeHit', type);
		const [damage, crit, block, evasion, superHit] = this.calcDamage(type);
		this.resetTimeoutTicks();
		this.getEnemy().curhp -= damage;
		fight.setLog(this, this.getEnemy(), damage, type, crit, block, evasion, superHit);
		const isFighterDeath = this.checkFighterDeath();
		if (fight.isFightEnd.value) return;
		this.setDelay();
		this.toggleTurn(isFighterDeath);
	}

	delayFn(cb, delay = 1000) {	setTimeout(() => { cb(); }, delay) };
	setDelay() {
		this.foreachEnemy(f => {	f.delay = true; this.delayFn(() => { f.delay = false; }) });
	}

	resetTimeoutTicks() {
		this.timeoutTicks = 0;
	}

	nextTimeoutTicks() {
		return ++this.timeoutTicks;
	}

	checkTimeoutDeath() {
		return this.nextTimeoutTicks() >= 3;
	}

	// callback for both enemies
	foreachEnemy(cb) {
		[this, this.getEnemy()].forEach(fighter => cb(fighter));
	}

	toggleTurn(isFighterDeath = false) {
		this.delayFn(() => {
			if (this.canSwap(isFighterDeath)) {
				fight.setPairs();
			} else {
				const [turn] = this.selectTurn();
				this.swap[HIT_TURN] = turn;
				this.swap[TURN_TIME] = Date.now();
				fight.handleBot(this.getEnemy());
			}
		}, 500);
	}

	setSwap() {
		const [turn, hitter] = this.selectTurn();
		const swap = [this.fId, this.getEnemy().fId, turn, 2, Date.now()];

		fight.handleBot(hitter);

		this.foreachEnemy(f => {
			f.lastEnemyId = f.getEnemy().fId;
			f.swap = swap;
			fight.swap[f.fId] = swap;
		});
	}

	canSwap(isEnemyDeath) {
		// if hit swap was held or enemy defeated
		if (!--this.swap[HITS_COUNT] || isEnemyDeath) {
			this.foreachEnemy(f => {
				f.e = f.swap = null;
				delete fight.swap[f.fId];
				if (f.curhp > 0) fight.addToFreeFighters(f);
			});

			return true;
		}

		return false;
	}


	calcDamage(type) {
		const superHitLevel = this.checkSuperHit(type);
		let [crit, evasion, block, superHit] = checkAttack(this, this.getEnemy(), type, superHitLevel);
		let damage = rand(this.min_damage, this.max_damage);

		// If critical is active then block noesn't work
		if (evasion) {
			damage = 0;
			crit = false;
		} else if (crit) {
			damage *= 2;
		} else if (block) {
			damage = 0;
			crit = false;
		}

		if (this.getEnemy().curhp < damage) {
			damage = +this.getEnemy().curhp;
		}
		this.damage += damage;

		return [damage, crit, block, evasion, superHitLevel];
	}

	isCrit() {
		return !!rand(0, 1)
	}

	checkFighterDeath(byTimeout = false) {
		const fighter = this.getEnemy();
		if (fighter.curhp <= 0) {
			this.kills += 1;
			fighter.kill();
			return true;
		}

		return false;
	}

	kill() {
		this.curhp = 0;
		this.swap = null;
		fight.isEnd(this);
	}

	selectTurn() {
		const isPrevEnemy = this.lastEnemyId === this.getEnemy().fId;
		const turn = (!isPrevEnemy ? rand(0, 1) : (this.turn ? 0 : 1)) + 0;
		this.turn = this.getEnemy().turn = turn;
		const [hitter, defender] = setRoles(this);

		return [turn, hitter, defender];
	}

	isHitter() {
		return this.team === this.turn;
	}
}


Fighter.prototype.checkSuperHit = checkSuperHit;

function stopTimer() {
	clearInterval(myTimerId);
}

function setRoles(f) {
	return f.isHitter() ? [f, f.getEnemy()] : [f.getEnemy(), f];
}