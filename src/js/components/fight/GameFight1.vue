<template>
	{{fight.freeFightersIds}}<br>
	{{fight.botsHits}}<br>
	{{fight.swap}}<br>
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
						<div class="enemy-stats col-md-5" v-if="user.enemy  && !isChangingEnemy">
							<user-short-info :user="user.enemy"></user-short-info>
						</div>
					</div>
					<div class="timer" v-if="user.enemy && timer">{{time}}</div>
					<div class="controls" v-if="user.enemy && turn && !isChangingEnemy">
						<div><button @click="user.hit(user, user.enemy, 1)">&rarr;</button></div>
						<div><button @click="user.hit(user, user.enemy, 2)">&rarr;</button></div>
						<div><button @click="user.hit(user, user.enemy, 3)">&rarr;</button></div>
					</div>
				</div>
				<img :src="'/img/locations/lake.jpeg'" class="location">
				<!-- <fighter-model side="left" :damage="damageMe" :key="1"></fighter-model>
				<fighter-model side="right" :damage="damageEnemy" :key="2" class="enemy-fighter" :class="{change: !user.enemy ||isChangingEnemy}"></fighter-model> -->
			</div>
			<div v-if="isFightEnd">
				<b>Fight has finished!</b>
				<!-- <button @click="$emit('setCurComp', 'FightStats')">Statistics</button> -->
			</div>
			<div v-for="(s, idx) in fight.swap" :key="idx">{{idx}}: {{s}}</div>
			<div><button @click="reset">Reset</button></div>
			<div><button @click="stopAllTimers()">Stop timers</button></div>
		</div>
		<div class="col-md-2 center">
			<div v-if="user.enemy" class="center">
				<div v-if="isChangingEnemy" class="changing-enemy icon-spin3 active"></div>
				<user-form v-else
					:items="[]"
					:user="user.enemy"
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
						<div v-for="(f, idx) in teams[0]" :key="idx">
							<div :class="{active: user.enemy?.id == f.id}">
								<user-short-info :user="f" shrink></user-short-info>
							</div>
						</div>
					</div>
					<button @click="createBots(null, 1, 0); setPairs();">Добавить бота</button>
				</div>
				<div class="col-md-6 team2">
					<div class="team-title">Команда 2<hr></div>
					<div class="fighter-list">
						<div v-for="(f, idx) in teams[1]" :key="idx">
							<div :class="{active: user.enemy?.id == f.id}">
								<user-short-info :user="f" shrink></user-short-info>
							</div>
						</div>
					</div>
					<button @click="createBots(null, 1, 1); setPairs();">Добавить бота</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { setup, computed } from 'vue'
import UserForm from '../user/form/UserForm'
import UserShortInfo from '../user/form/UserShortInfo'
import FighterModel from './FighterModel'
import Fight from './use/Fight'
import Fighter from './use/Fighter'

export default {
	components: { UserShortInfo, UserForm, FighterModel },

	setup() {
		const fight = new Fight();

		const turn = computed(() => fight.user.turn === fight.user.team);


		return {
			turn,
			fight,
			user: 							fight.user,
			teams: 							fight.teams,
			isFightEnd: 				fight.isFightEnd,
			isChangingEnemy: 		fight.isChangingEnemy,
			timer: 							fight.timer,
			createBots: 				fight.createBots,

			reset: () => { fight.init() },
		}
	}
}


</script>