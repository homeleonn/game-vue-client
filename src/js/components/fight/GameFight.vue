<template>
	<div class="fight row" v-if="enemy">
		<div class="col-md-4">
			<user-form
				:items="[]"
				:user="user"
				:info="[]"
				isFight
			></user-form>
			{{user}}
		</div>
		<div class="col-md-4 flex fcol fight-panel">
			<div><button @click="reset">Reset</button></div>
			<div v-if="turn">
				<div><button @click="hit(HIT_HEAD)">В голову</button></div>
				<div><button @click="hit(HIT_CHEST)">В корпус</button></div>
				<div><button @click="hit(HIT_LEGS)">В ноги</button></div>
			</div>
			<div>{{timer}}</div>
			<div v-for="log in damageLog" :key="log">
				{{log}}
			</div>
		</div>
		<div class="col-md-4">
			<user-form
				:items="[]"
				:user="enemy"
				:info="[]"
				isFight
			></user-form>
			{{enemy}}
		</div>
	</div>
</template>

<script>
import UserForm from '../user/form/UserForm'
import { mapGetters } from 'vuex'


export default {
	data() {
		return {
			enemy: null,
			turn: null,
			timer: null,
			damageLog: [],
			HIT_HEAD: 1,
			HIT_CHEST: 2,
			HIT_LEGS: 3,
		}
	},

	hitVerbs: {
		1: 'голову',
		2: 'корпус',
		3: 'ноги',
	},
	mdt: null,
	timer: null,

	inject: [
		'api',
		'apiSubscribe'
	],

	created() {
		this.apiSubscribe([
			'_enemy'
		], this);
	},

	computed: {
		...mapGetters(['user']),
		monsterTurn() {
			return !this.turn;
		},
	},

	mounted() {
		this.api.doAction('getEnemy', 1);
	},

	updated() {
		// _('.fight-panel button').on('click', function() {
		// 	cl(2)
		// })
	},

	methods: {
		_enemy(enemy) {
			this.enemy = enemy;
			if (this.enemy.name) {
				this.enemy.login = this.enemy.name;
			}
		},

		hit(type) {
				cl(2)
			const hitter = !this.monsterTurn ? this.user : this.enemy;
			const defener = this.monsterTurn ? this.user : this.enemy;
			const damage = this.damage(hitter);
			defener.curhp -= damage;
			if (defener.curhp <= 0) defener.curhp = 0;
			this.damageLog.unshift(`${hitter.login}[${hitter.level}] ударил ${defener.login}[${defener.level}] в ${this.$options.hitVerbs[type]} на -${damage}`);
			this.toggleTurn();
			this.timer = 20;

			if (this.monsterTurn) {
				this.$options.mdt = this.monsterDamageTime();
			}
		},

		damage(user) {
			return rand(user.min_damage, user.max_damage);
		},

		reset() {
			this.damageLog = [];
			const secondsForHit = 20
			this.turn = !!rand(0, 1);
			this.timer = secondsForHit;
			this.enemy.curhp = this.user.curhp = 100;

			this.$options.mdt = this.monsterDamageTime();

			clearInterval(this.$options.timer);
			this.$options.timer = setInterval(() => {
				this.timer--;
				if (!this.timer) {
					this.timer = secondsForHit;
					this.toggleTurn();
				}

				if (this.monsterTurn) {
					if (this.timer < secondsForHit - this.$options.mdt) {
						this.hit(rand(1, 3));
					}
				}
			}, 1000)
		},

		monsterDamageTime() {
			const t = rand(0, 3);
			// cl(t);
			return t;
		},

		toggleTurn() {
			this.turn = !this.turn;
		}
	},

	components: { UserForm }
}
</script>

<style lang="scss">
.fight {
	.user-form-wrapper {
		margin: 0 auto;
	}
	justify-content: space-between;

	.fight-panel {
		text-align: center;
		margin-top: 20px;
		button {
			min-width: 100px;
			display: block;
			margin: 10px auto;
		}
	}
}
</style>