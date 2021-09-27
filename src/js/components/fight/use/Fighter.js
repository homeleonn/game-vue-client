let myTimerId;
let fight;
let isMe;

export default class Fighter {
	constructor(fighter, _fight, _isMe = false) {
		fight = _fight;
		isMe = _isMe;
		for (const prop in fighter) {
			this[prop] = fighter[prop];
		}
	}

	pullEnemy() {
		const enemyTeam 			= fight.getEnemyTeam(this.team);
		const freeEnemiesIds 	= fight.freeFightersIds[enemyTeam];
		const freeMembersIds 	= fight.freeFightersIds[this.team];
		const myIdIndex			 	= freeMembersIds.indexOf(+this.id);
		const enemyIdIndex	 	= rand(0, freeEnemiesIds.length - 1);
		const fighterId 			= freeEnemiesIds[enemyIdIndex];
		this.enemy 						= fight.teams[enemyTeam][fighterId];
		this.enemy.enemy 			= this;

		fight.removeFreeFighter(myIdIndex, this);
		fight.removeFreeFighter(enemyIdIndex, this.enemy);

		this.setSwap();
	}

	hit(type) {
		const [hitter, defender] = setRoles(this);
		const [damage, crit] = this.calcDamage();
		defender.curhp -= damage;
		this.removeTurn(hitter.id);
		// this.setLog(hitter, defender, damage, type, crit);
		const isFighterDeath = this.checkFighterDeath(hitter, defender);
		fight.toggleTurn(hitter, defender, isFighterDeath);
	}

	calcDamage() {
		let damage = rand(this.min_damage, this.max_damage);
		const crit = this.isCrit();

		if (crit) {
			damage *= 2;
		}
		if (this.enemy.curhp < damage) {
			damage = +this.enemy.curhp;
		}
		this.damage += damage;

		return [damage, crit];
	}

	isCrit() {
		return !!rand(0, 1)
	}

	checkFighterDeath(hitter, defender) {
		if (defender.curhp <= 0) {
			hitter.kills += 1;
			defender.curhp = 0;
			delete fight.freeFighters[defender.team][defender.id];
			fight.checkEndFight(defender);
			return true;
		}

		return false;
	}

	selectTurn(f1, f2) {
		const isPrevEnemy = this.lastEnemyId === this.enemy.id;
		const turn = !isPrevEnemy ? rand(0, 1) : (this.turn ? 0 : 1);
		const [hitter, defender] = setRoles(this);
		this.turn = this.enemy.turn = turn;

		return [turn, hitter, defender];
	}

	isHitter() {
		return this.team === this.turn;
	}

	setSwap() {
		const [turn, hitter, defender] = this.selectTurn();
		const swap = [this.id, this.enemy.id, turn, 2];

		fight.handleBot(hitter.id);
		this.setMyEnemy(hitter, defender);

		// cl(this, this.enemy); return;
		
		this.lastEnemyId = this.enemy.id;
		this.enemy.lastEnemyId = this.id;

		fight.swap[this.id] = swap;
		fight.swap[this.enemy.id] = swap;
	}

	setMyEnemy(f1, f2) {
		if (!fight.isMyPair(f1, f2)) return;
		let isHitter = f1.isMe();

		this.setMyTurn(f1, f2, isHitter);
		if (this.lastEnemyId && this.lastEnemyId !== this.enemy.id) {
			fight.isChangingEnemy.value = true;
			setTimeout(() => { fight.isChangingEnemy.value = false; }, 1000)
		}
	}

	setMyTurn(f1, f2, isMyTurn) {
		if (!fight.isMyPair(f1, f2)) return;
		fight.turn = isMyTurn;
		fight.timer.value = 10;

		myTimerId = setInterval(() => {
			fight.timer.value--;
			if (!fight.timer.value && isMyTurn) {
				this.removeTurn(true);
				fight.toggleTurn(f1, f2);
			}
		}, 1000);
	}

	removeTurn(turnFighterId = true) {
		if (turnFighterId === true || this.isMe(turnFighterId) || turnFighterId === fight.user.lastEnemyId) {
			this.turn = fight.timer.value = null;
			stopTimer();
		}
	}

	isMe(id = null) {
		return !id ? isMe : id === this.id;
	}
}

function stopTimer() {
	clearInterval(myTimerId);
}

function setRoles(f) {
	return f.isHitter() ? [f, f.enemy] : [f.enemy, f];
}