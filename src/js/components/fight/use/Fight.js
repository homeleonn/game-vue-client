class Fight
{
	construct() {
		this.teams = [{}, {}];
		this.freeFighters = [{}, {}];
		this.freeFightersIds = [[], []];
	}

	addFighter(fighter) {
		this.teams[fighter.team].push(fighter)
		this.freeFighters[fighter.team][fighter.id] = null;
		this.freeFightersIds[fighter.team].push(fighter);
	}


	getEnemy(fighter) {
		const enemyTeam = this.team === 0 ? 1 : 0;
		const fighterIdKey = rand(0, freeEnemiesIds.length - 1);
		const fighterId = freeEnemiesIds[fighterIdKey];
		freeEnemiesIds.splice(fighterIdKey, 1);

		return this.fight.getEnemyTeam()[fighterId];
	}
}