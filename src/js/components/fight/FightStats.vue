<template>
	<div class="fight-stats " v-if="this.$store.state.fightStats">
		<h4 class="center">Бой окончен! Вы нанесли <b>{{ user.damage }}</b> урона, убийств: <b>{{ user.kills }}</b>. Получено опыта <b>{{ user.fightExp }}</b>.</h4>
		<div class="row">
			<div class="col-md-3">
				<img src="/img/fight/5.jpg">
			</div>
			<div class="col-md-6 stats myblock center">
				<div class="row buttons">
					<div class="col-md-4">
						<button class="btn" @click="$emit('setCurComp', 'LocationWrapper')">В локацию</button>
					</div>
					<div class="col-md-4">
						<button @click="$emit('setCurComp', 'UserBackpack')">В рюкзак</button>
					</div>
					<div class="col-md-4">
						<button @click="$emit('setCurComp', 'TheHunting')">На охоту</button>
					</div>
				</div>

				<hr>

				<div class="row times">
					<div class="col-md-4">
						<!-- Начало боя: 23.09.2021 18:01:47 -->
						Начало боя: {{ formattedStartTime }}
					</div>
					<div class="col-md-4">
						Победила {{ !$store.state.fightStats.winTeam ? 1 : 2 }}я команда
					</div>
					<div class="col-md-4">
						<!-- Длительность: 00 мин 57 сек -->
						Длительность: {{ fightDuration }}
					</div>
				</div>

				<hr>

				<div class="row teams">
					<div class="col-md-6 team1">
						<h5>1я команда</h5>
						<hr>
						<table border="1">
							<tr>
								<th>Игрок</th>
								<th>Опыт</th>
								<th>Урон</th>
								<th>Убийств</th>
							</tr>
							<tr v-for="fighter in $store.state.fightStats.teamsStatisticts[0]" :key="fighter.id">
								<td>{{fighter.login}}[{{fighter.level}}]</td>
								<td>{{fighter.fightExp}}</td>
								<td>{{fighter.damage}}</td>
								<td>{{fighter.kills}}</td>
							</tr>
						</table>
					</div>
					<div class="col-md-6 team2">
						<h5>2я команда</h5>
						<hr>
						<table border="1">
							<tr>
								<th>Игрок</th>
								<th>Опыт</th>
								<th>Урон</th>
								<th>Убийств</th>
							</tr>
							<tr v-for="fighter in $store.state.fightStats.teamsStatisticts[1]" :key="fighter.id">
								<td>{{fighter.login}}[{{fighter.level}}]</td>
								<td>{{fighter.fightExp}}</td>
								<td>{{fighter.damage}}</td>
								<td>{{fighter.kills}}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			<div class="col-md-3">
				<img src="/img/fight/4.jpg">
			</div>
		</div>
	</div>
</template>

<script>
// const user = { id: 1, login: 'Admin', level: 0, fightExp: 10, damage: 55, kills: 2 };
export default {
	// props: ['teams'],
	emits: ['setCurComp'],

	data() {
		return {
			user: {},
			// teams: [
			// 	[
			// 		user,
			// 	],
			// 	[
			// 		{ id: 100, login: 'Ящер', level: 0, fightExp: 0, damage: 70, kills: 0 },
			// 		{ id: 101, login: 'Ящер', level: 0, fightExp: 150, damage: 70, kills: 1 },
			// 	],
			// ],
			// winTeam: 0,
			// startTime: Date.now() - 1000 * 2000,
		}
	},

	computed: {
		formattedStartTime() {
			return date('Y-m-d H:i:s', new Date(this.$store.state.fightStats.startTime * 1000));
		},

		fightDuration() {
			const fightSecondsLeft = (new Date().getTime() - new Date(this.$store.state.fightStats.startTime) * 1000) / 1000;
			return timer(fightSecondsLeft);
		}
	},

	mounted() {
		if (!this.$store.state.fightStats) return;
		let isUserFound = false;
		this.$store.state.fightStats.teamsStatisticts.forEach(team => {
			if (isUserFound) return;
			for (const fighterId in team) {
				if (+team[fighterId].id === this.$store.state.user.id) {
					this.user = team[fighterId];
					isUserFound = true;
					return;
				}
			}
		})
	}
}
</script>

<style lang="scss">
.fight-stats {
	h4 {
		padding-top: 10px;
		// margin-top: 10px;
		// border: 1px solid transparent;
	}

	img {
		display: block;
		margin: 0 auto;
	}

	.stats {
		.row {
			margin-bottom: 20px;
		}

		.buttons button {
			display: inline-block;
			margin: 0 auto;

			// &.btn {
				border: 2px #fcbebe outset;
				padding: 8px;
				line-height: 1;
				border-radius: 5px;
				background: lightblue;
				// background: rgba(255, 255, 255, .5);
				font-weight: bold;
			// }
		}

		.times {
			font-weight: bold;
		}

		.teams {
			// h5
		}

		.team1, .team2 {
			padding: 10px;
		}

		.team1 {
			h5 {
				color: firebrick;
			}
		}

		.team2 {
			h5 {
				color: mediumblue;
			}
		}

		table {
			width: 100%;
			// border-collapse: separate;
			// border-spacing: 20px;

			tr:nth-child(odd) {
				background: rgba(0, 0, 0, .1);
			}

			th {
				background: lightblue;
			}


			tr, td, th {
				border-width: 1px;
			}
		}
	}
}
</style>
