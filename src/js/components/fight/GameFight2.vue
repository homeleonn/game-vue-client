<template>
	<!-- <button @click="fight.botNextTick()"> next tick</button><br> -->
	<!-- {{isChangingEnemy}} -->
	<!-- {{fight.freeFightersIds}}
	{{fight.botsHits}}<br>
	{{fight.swap}}<br>
	{{renderUser}}<br>
	{{turn}}<br> -->
	<!-- {{fight.teams}}<br> -->
	<div class="fight row center">
		<div class="col-md-2">
			<user-form
				:items="[]"
				:user="user"
				:info="[]"
				:isFight="false"
			></user-form>
		</div>
		<div class="col-md-4 flex fcol fight-panel">
			<div class="fighters">
				<div class="stats-wrapper">
					<div class="stats">
						<div class="user-stats col-md-5">
							<user-short-info :user="user"></user-short-info>
						</div>
						<div class="col-md-2 damage-score">
							<div>Нанесено урона</div>
							<div>{{user.damage}}</div>
						</div>
						<div class="enemy-stats col-md-5" v-if="user.getEnemy() && !isChangingEnemy">
							<user-short-info :user="user.getEnemy()"></user-short-info>
						</div>
					</div>
					<div class="timer" v-if="user.getEnemy() && !user.delay && !isChangingEnemy">{{ timer }}</div>
					<div class="controls" v-if="user.getEnemy() && turn && !user.delay && !isChangingEnemy && !fight.isFightEnd.value">
						<div><button @click="hit(1)">&rarr;</button></div>
						<div><button @click="hit(2)">&rarr;</button></div>
						<div><button @click="hit(3)">&rarr;</button></div>
					</div>
					<div class="end-fight" v-if="fight.isFightEnd.value">
						<div class="title">Бой окончен</div>
						<div class="content">{{ user.team === fight.winTeam ? 'Победа' : 'Поражение'}}</div>
						<button class="fight-exit" @click="toStatistics">Выход</button>
					</div>
					<div class="super-hit" v-if="user.superHit">Супер-удар</div>
				</div>
				<img :src="'/img/locations/lake.jpeg'" class="location">
				<fighter-model side="left" :damage="user.damageMe" :key="1"></fighter-model>
				<fighter-model side="right" :damage="user.damageEnemy" :key="2" class="enemy-fighter" :class="{change: !user.getEnemy() || isChangingEnemy}"></fighter-model>
			</div>
			<!-- <div v-for="(s, idx) in fight.swap" :key="idx">{{idx}}: {{s}}</div> -->
			<div><button @click="reset">Reset</button></div>
			<div><button @click="fight.stopAllTimers()">Stop timers</button></div>
		</div>
		<div class="col-md-2 center">
			<div v-if="user.getEnemy()" class="center">
				<div v-if="isChangingEnemy" class="changing-enemy icon-spin3 active"></div>
				<user-form v-else
					:items="[]"
					:user="user.getEnemy()"
					:info="[]"
					:isFight="false"
				></user-form>
			</div>
			<div v-else>
				<h3>Ожидание противника...</h3>
			</div>
		</div>
		<div class="col-md-4">
			<div class="teams myblock row center">
				<div class="col-md-6 team1">
					<div class="team-title">Команда 1<hr></div>
					<div class="fighter-list">
						<div v-for="(f, idx) in fight.teams[0]" :key="idx">
							<div :class="{active: user.getEnemy()?.id == f.id}">
								<user-short-info :user="f" shrink></user-short-info>
							</div>
						</div>
					</div>
					<!-- <button @click="fight.createBots(null, 1, 0); fight.setPairs();">Добавить бота</button> -->
				</div>
				<div class="col-md-6 team2">
					<div class="team-title">Команда 2<hr></div>
					<div class="fighter-list">
						<div v-for="(f, idx) in fight.teams[1]" :key="idx">
							<div :class="{active: user.getEnemy()?.id == f.id}">
								<user-short-info :user="f" shrink></user-short-info>
							</div>
						</div>
					</div>
					<!-- <button @click="fight.createBots(null, 1, 1); fight.setPairs();">Добавить бота</button> -->
				</div>
			</div>
		</div>
	</div>
	<div>
		<!-- {{fight.fighters}}
		{{fight.teams}} -->
		<!-- {{fight}} -->
	</div>
</template>
<script>
import { setup, computed, watch, ref, toRef, onMounted, onCreated, inject } from 'vue'
import UserForm from '../user/form/UserForm'
import UserShortInfo from '../user/form/UserShortInfo'
import FighterModel from './FighterModel'
import Fight from './use/Fight'

export default {
	components: { UserShortInfo, UserForm, FighterModel },

	setup(props, { emit }) {
		const HIT_TURN = 2;
		const api = inject('api');
		const apiSubscribe = inject('apiSubscribe');

		const fight = new Fight();
		const turn = computed(() => fight.user.swap[HIT_TURN] === fight.user.team);
		const isChangingEnemy = ref(false);
		let lastEnemyId = fight.user.lastEnemyId;
		let isChangingEnemyTimer = null;
		let timer1 = ref('');

		let hitter, defender;
		apiSubscribe({
			_fight: (fightData) => { 
				if (fightData.fighters) {
					fight.setFighters(fightData.fighters);
				} else if (fightData.hit) {
					cl(fightData.hit);
					if (fightData.hit.defender === fight.user.swap[1]) {
						hitter = fight.user;
						defender = fight.fighters[fightData.hit.defender];
					} else if (fightData.hit.defender === fight.user.swap[0]) {
						hitter = fight.fighters[fightData.hit.defender];
						defender = fight.user;
					}
					defender.curhp -= fightData.hit.damage;
					fight.setLog(hitter, defender, fightData.hit.damage, fightData.hit.type, fightData.hit.crit, fightData.hit.block, fightData.hit.evasion, fightData.hit.superHit);
				}
			},
		});

		watch(fight.user, (newV, oldV) => {
			if (newV.lastEnemyId === lastEnemyId) return
			lastEnemyId = newV.lastEnemyId;
			isChangingEnemy.value = true;
			clearTimeout(isChangingEnemyTimer);
			isChangingEnemyTimer = setTimeout(() => {	isChangingEnemy.value = false; }, 1000);
		});

		function runTimer() {
			setInterval(() => {
				const timeout = fight.user.getTimeTurnLeft();
				// timer1.value = timeout === null ? timeout : timer(timeout > 0 ? timeout : 0, 'i:s');
				timer1.value = timeout === null ? timeout : timer(timeout, 'i:s');
			}, 1000)
		}

		onMounted(() => {
			api.doAction('getFight');
			runTimer();
		});



		function toStatistics() {
			emit('setCurComp', 'FightStats');
		}

		return {
			fight,
			toStatistics,
			turn,
			user: 							fight.user,
			timer: timer1,
			isChangingEnemy,

			hit: (type) => { api.doAction('hit', type); fight.user.hit(type) },

		// 	reset: () => { fight.init() },
		}
	}
}


</script>

<style lang="scss">
.fight {
	.super-hit {
		font-size: 50px;
		color: gold;
		position: absolute;
		top: 50px;
		left: 0;
		right: 0;
	}
}
</style>