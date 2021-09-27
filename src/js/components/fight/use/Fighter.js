let myTimerId;
let fight;
let isMe;

class Fighter
{
	constructor(fighter, _fight, _isMe = false) {
		fight = _fight;
		isMe = _isMe;
		for (const prop in fighter) {
			this[prop] = fighter[prop];
		}
	}

	pullEnemy(freeEnemiesIds) {
		const enemyTeam 			= fight.getEnemyTeam(team);
		const freeEnemiesIds 	= fight.freeFightersIds[enemyTeam];
		const freeMembersIds 	= fight.freeFightersIds[team];
		const myIdKey			 		= freeMembersIds.find(id => +id === +this.id);
		const enemyIdKey	 		= rand(0, freeEnemiesIds.length - 1);
		const fighterId 			= fight.freeEnemiesIds[enemyIdKey];
		this.enemy 						= fight.teams[enemyTeam][fighterId];
		this.enemy.enemy 			= this;

		fight.removeFreeFighter(enemyIdKey, this);
		fight.removeFreeFighter(enemyIdKey, this.enemy);
	}

	setMyEnemy(hitter, defender) {
		if (!this.isMyPair(hitter, defender)) return;
		let isHitter = hitter.isMe();

		this.setMyTurn(hitter, defender, isHitter);
		if (this.lastEnemyId && this.lastEnemyId !== enemy.id) {
			this.isChangingEnemy.value = true;
			setTimeout(() => {
				this.isChangingEnemy.value = false;
			}, 1000)
		}
	}

	isMyPair(f1, f2) {
		return f1.isMe() || f2.isMe();
	}

	setMyTurn(f1, f2, isMyTurn) {
		this.turn = isMyTurn;
		this.timer.value = 10;

		myTimerId = setInterval(() => {
			this.timer.value--;
			if (!this.timer.value && isMyTurn) {
				this.removeMyTurn(true);
				this.toggleTurn(f1, f2);
			}
		}, 1000);
	}



	toggleTurn(f1, f2, isFighterDeath = false) {
		if (this.isFightEnd) return;
		if (fight.canSwap(f1, f2, isFighterDeath)) {
			if (this.isMyPair(f1, f2)) {
				setTimeout(() => {
					this.enemy = null;
					fight.setPairs();
				}, 1000);
			} else {
				fight.setPairs();
			}
		} else {
			fight.swap[f1.id][HIT_TURN] = f1.selectTurn(f1, f2);
			const turnFighterTeam = fight.swap[f1.id][HIT_TURN] ? 1 : 0;
			const turnFighterId = fight.swap[f1.id][turnFighterTeam];
			this.setMyTurn(f1, f2, turnFighterId);
			if (this.isBot(turnFighterId)) {
				this.botsHits[turnFighterId] = monsterDamageTime(); // todo: in method
			}
		}
	}

	removeMyTurn(turnFighterId = true) {
		if (turnFighterId === true || turnFighterId === this.user.lastEnemyId) {
			this.turn = this.timer = null;
			stopTimer();
		}
	}

	selectTurn() {
		const isPrevEnemy = this.lastEnemyId === this.enemy.id;
		const turn = !isPrevEnemy ? rand(0, 1) : (this.turn ? 0 : 1);
		this.turn = turn;

		return turn;
	}

	isMe() {
		return isMe;
	}
}

function stopTimer() {
	clearInterval(myTimerId);
}