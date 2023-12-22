<template>
	<!-- <button @click="fight.botNextTick()"> next tick</button><br> -->
	<!-- {{isChangingEnemy}} -->
	<!-- {{fight.freeFightersIds}}
	{{fight.botsHits}}<br>
	{{fight.swap}}<br>
	{{renderUser}}<br>
	{{turn}}<br> -->
	<!-- {{fight.teams}}<br> -->
	<!-- {{getEnemy1}} -->
	<!-- {{user.enemyfId}} -->
	<div class="fight row center" v-if="loaded">
		<div class="fighter-slot-left">
			<user-form
				:items="wearedItems"
				:user="user"
				:info="[]"
				:isFight="false"
			></user-form>
		</div>
		<div class="flex fcol fight-panel" :style="`background-image: url('/img/locations/${image}')`">
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
				<fighter-model side="left" :damage="user.damageMe" :key="1"></fighter-model>
				<fighter-model side="right" :damage="user.damageEnemy" :key="2" class="enemy-fighter" :class="{change: !user.getEnemy() || isChangingEnemy}"></fighter-model>
			</div>
			<!-- <div v-for="(s, idx) in fight.swap" :key="idx">{{idx}}: {{s}}</div> -->
			<!-- <div><button @click="reset">Reset</button></div> -->
			<!-- <div><button @click="fight.stopAllTimers()">Stop timers</button></div> -->
		</div>
		<div class="center fighter-slot-right">
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
		<div class="teams-wrapper">
			<div class="teams myblock row center">
				<div class="col-md-6 team1">
					<div class="team-title">Команда 1<hr></div>
					<div class="fighter-list">
						<div v-for="(f, idx) in fight.teams[0]" :key="idx">
							<div :class="{active: user.getEnemy()?.fId == f.fId}" class="fighter-list-item">
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
							<div :class="{active: user.getEnemy()?.fId == f.fId}" class="fighter-list-item">
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
import { computed, watch, ref, toRef, onMounted, inject, reactive } from 'vue'
import { useStore } from 'vuex'
import UserForm from '../user/form/UserForm.vue'
import UserShortInfo from '../user/form/UserShortInfo.vue'
import FighterModel from './FighterModel.vue'
import Fight from './use/Fight'
import { filterByLoc, loadUserItems } from '@/js/common'

export default {
	components: { UserShortInfo, UserForm, FighterModel },

	setup(props, { emit }) {
		const store = useStore();
		const HIT_TURN = 2;
		const HITS_COUNT = 3;
		const api = inject('api');
		const apiSubscribe = inject('apiSubscribe');

		const fight = new Fight();
		const user = fight.user;
		const wearedItems = computed(() => filterByLoc(store.state.userItems, 'WEARING') || []);
		const turn = computed(() => user.swap && user.swap[HIT_TURN] === user.team && user.hitsExist());
		const isChangingEnemy = ref(false);
		const timer1 = ref('');
		const loaded = ref(false);
		let isChangingEnemyTimer = null;
		let timerId;
		let enemyTeam;
		let clearEnemyTimer;
		let fightDataReceived = false;

		let hitter, defender;
		apiSubscribe({
			_fight: (fightData) => {
				const d = fightData;
				if (d.fighters) {
					fight.setFighters(d.fighters);
					loaded.value = true;
					enemyTeam = user.team == 0 ? 1 : 0;
				}

				if (d.hit) {
					hitter = fight.fighters[d.hit.hitter];
					defender = fight.fighters[d.hit.defender];
					defender.curhp -= d.hit.damage;
					hitter.damage += d.hit.damage;

					if (hitter.isMe() || defender.isMe()) {
						fight.setLog(hitter, defender, d.hit.damage, d.hit.type, d.hit.crit, d.hit.block, d.hit.evasion, d.hit.superHit);

						user.swapTick();
						if (!user.hitsExist()) {
							clearEnemyTimer = user.clearEnemy();
						}
					}
				}

				if (d.kill) {
					const fId = d.kill.fId;
					fight.fighters[fId].curhp = 0;
					if (user.fId == fId || user.enemyfId == fId) {
						clearTimeout(clearEnemyTimer);
						clearEnemyTimer = user.clearEnemy();
					}
				}

				if (d.swap && fight.loaded) {
					clearTimeout(clearEnemyTimer);
					user.swap = d.swap;
					changeEnemy(d.swap);
				}

				if (d.statistics) {
					fight.winTeam = d.statistics.winTeam;
					fight.isFightEnd.value = true;
					store.commit('SET_FIGHTSTATS', d.statistics);
				}
			},

			new_fighter(fighter) {
				// console.log(fighter);
				fight.setFighters(fighter);
			}
		});

		function changeEnemy(swap) {
			const enemyfId = swap[enemyTeam];
			if (user.lastEnemyfId == enemyfId) return;
			if (user.lastEnemyfId == null) {
				user.setEnemy(fight.fighters[enemyfId]);
				user.lastEnemyfId = enemyfId;
				return;
			} else {
				user.lastEnemyfId = enemyfId;
			}
			clearTimeout(isChangingEnemyTimer);
			setTimeout(() => { isChangingEnemy.value = true; }, 500)
			isChangingEnemyTimer = setTimeout(() => {
				isChangingEnemy.value = false;
				user.setEnemy(fight.fighters[enemyfId]);
			}, 1000);
		}

		// watch(user.swap, (newV, oldV) => {
		// 	console.log(newV)
		// });
		const getEnemy1 = computed(() => user.getEnemy());

		function runTimer() {
			timerId = setInterval(() => {
				if (fight.isFightEnd.value) {
					timer1.value = '';
					clearInterval(timerId);
					return;
				}
				let timeout = user.getTimeTurnLeft();
				timer1.value = timeout === null ? timeout : timer(timeout > 0 ? timeout : 0, 'i:s', false);
				// timer1.value = timeout === null ? timeout : timer(timeout, 'i:s');
			}, 1000)
		}

		onMounted(() => {
			loadUserItems(api, store);
			setTimeout(() => {
				api.doAction('getFight', null, () => {
					fightDataReceived = true;
				});
				setTimeout(() => {
					checkReceivingFightData();
				}, 1000);
			}, 0);
			runTimer();
		});

		function checkReceivingFightData() {
			if (!fightDataReceived) {
				api.doAction('getFight');
			}
		}

		const image = computed(() => store.state.location.image);

		function toStatistics() {
			emit('setCurComp', 'FightStats');
		}

		function hit(type) {
			api.doAction('hit', type);
			user.hit(type);
		}

		return {
			fight,
			toStatistics,
			turn,
			user,
			timer: timer1,
			isChangingEnemy,
			loaded,
			getEnemy1,
			image,

			hit,
			wearedItems,

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



	@media (max-width: 1366px) {
		.fighter-slot-right,
		.fighter-slot-left {
			width: 80px;
		}
		.fighter-slot-left {
			margin-left: 90px;
		}
		.fighter-slot-right {
			margin-left: 30px;
		}

		.fight-panel {
			width: 530px;
		}

		.teams-wrapper {
			width: 300px;
		}
	}

	.fight-panel {
		background-size: 200%;
		background-position: 40% 90%;
	}
		.teams-wrapper {
			* {
				max-width: 99.5%
			}
		}
}


	@media (min-width: 1367px) {
		.fight {
			.fighter-slot-right,
			.fighter-slot-left {
				width: 20%;
			}

			.fight-panel {
				width: 40%;
			}
			.teams-wrapper {
				width: 20%;
			}
		}
	}
</style>
