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
		for (const prop in fighter) {
			this[prop] = fighter[prop];
		}
	}

	getEnemy() {
		return fight.fighters[this.e];
	}

	setEnemy(fighter) {
		this.e 		= fighter.id;
		fighter.e = this.id;
		// cl(this, fighter); return;
	}

	getTimeTurnLeft() {
		return Math.round((this.swap[TURN_TIME] - (Date.now() - TURN_TIME_TIMEOUT)) / 1000);
	}

	hit(type) {
		const [damage, crit] = this.calcDamage();
		this.getEnemy().curhp -= damage;
		fight.setLog(this, this.getEnemy(), damage, type, crit);
		const isFighterDeath = this.checkFighterDeath();
		if (fight.isFightEnd.value) return;
		this.toggleTurn(isFighterDeath);
	}

	toggleTurn(isFighterDeath = false) {
		if (this.canSwap(isFighterDeath)) {
			fight.setPairs();
		} else {
			const [turn] = this.selectTurn();
			this.swap[HIT_TURN] = turn;
			this.swap[TURN_TIME] = Date.now();
			fight.handleBot(this.getEnemy().id);
		}
	}

	setSwap() {
		const [turn, hitter] = this.selectTurn();
		const swap = [this.id, this.getEnemy().id, turn, 2, Date.now()];

		fight.handleBot(hitter.id);

		[this, this.getEnemy()].forEach(f => {
			f.lastEnemyId = f.getEnemy().id;
			f.swap = swap;
			fight.swap[f.id] = swap;
		})
	}

	canSwap(isEnemyDeath) {
		// if hit swap was held or enemy defeated
		if (!--this.swap[HITS_COUNT] || isEnemyDeath) {
			[this, this.getEnemy()].forEach(f => {
				f.e = f.swap = null;
				delete fight.swap[f.id];

				if (f.curhp > 0) fight.addToFreeFighters(f);
			});

			return true;
		}

		return false;
	}

	calcDamage() {
		let damage = rand(this.min_damage, this.max_damage);
		const crit = this.isCrit();

		if (crit) {
			damage *= 2;
		}
		if (this.getEnemy().curhp < damage) {
			damage = +this.getEnemy().curhp;
		}
		this.damage += damage;

		return [damage, crit];
	}

	isCrit() {
		return !!rand(0, 1)
	}

	checkFighterDeath() {
		const fighter = this.getEnemy();
		if (fighter.curhp <= 0) {
			this.kills += 1;
			fighter.curhp = 0;
			fight.checkEndFight(fighter);
			return true;
		}

		return false;
	}

	selectTurn() {
		const isPrevEnemy = this.lastEnemyId === this.getEnemy().id;
		const turn = (!isPrevEnemy ? rand(0, 1) : (this.turn ? 0 : 1)) + 0;
		this.turn = this.getEnemy().turn = turn;
		const [hitter, defender] = setRoles(this);

		return [turn, hitter, defender];
	}

	isHitter() {
		return this.team === this.turn;
	}

	isMe(id = null) {
		return !id ? isMe : id === this.id;
	}

	// get enemy() {
	// 	if (!this.e) return {};
	// 	const user = {};
	// 	// cl(this); return;
	// 	Object.keys(this.e).forEach(k => {
	// 		if (k === 'e') return;
	// 		user[k] = this.e[k];
	// 	});
	// 	// cl(user);
	// 	return user;
	// }

	// set enemy(enemy) {
	// 	this.e = enemy;
	// }
}

function stopTimer() {
	clearInterval(myTimerId);
}

function setRoles(f) {
	return f.isHitter() ? [f, f.getEnemy()] : [f.getEnemy(), f];
}