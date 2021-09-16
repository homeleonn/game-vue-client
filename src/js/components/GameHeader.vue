<template>
	<header>
		<div
			class="avatar"
			style="background-image: url('img/images/0.png')"
			title="Персонаж"
		></div>
		<div class="info-wrapper">
			<div class="info">
				<div class="align"><img src="img/aligns/99.gif" /></div>
				<div class="clan"><img src="img/clans/developers.png" /></div>
				<div class="login">{{ user.login }}[{{ user.level }}]</div>
			</div>
			<div class="hp-wrapper">
				<div class="hp-back">
					<div class="hp-line" :style="hpLineStyle"></div>
				</div>
				<div class="hp">{{ user.curhp }} / {{ user.maxhp }}</div><span class="icon-spin3 active" v-if="isRegenerating"></span>
			</div>
		</div>
		<!-- <button class="reset-hp" @click="reset">сбросить хп</button> -->
		<div class="top-panel flex">
			<div>
				<img
					src="img/other/pack.jpg"
					title="Рюкзак"
					@click="$emit('setCurComp', 'UserBackpack')"
				/>
			</div>
			<div>
				<img
					src="img/other/location.jpg"
					title="Локация"
					@click="$emit('setCurComp', 'LocationWrapper')"
				/>
			</div>
			<div><img src="img/other/fight.jpg" title="Бои" /></div>
			<div><img src="img/other/quest.jpg" title="Квесты" /></div>
			<div><img src="img/other/info.jpg" title="Анкета" /></div>
		</div>
		<div id="dblog">
			<div v-for="query in dbLog" :key="query">
				{{ query.query }}; t::{{ query.time }}; b::{{ query.bindings }};
				<hr />
			</div>
		</div>
	</header>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
	name: "GameHeader",

	data() {
		return {
			hpLineStyle: {},
		};
	},
	// options
	maxHpChanged: false,
	HpRestore: null,

	methods: {
		reset() {
			fetch("/user/reset").then(() => location.reload());
		},

		regeneration(curHp = 180, maxHp = 200, lastRestore) {
			const hp = (curHp, maxHp, lastRestore) => {
				return (lastRestoreTime = null) => {
					maxHp = this.user.maxhp;
					const time = getTimeSeconds();
					
					if (!lastRestore) lastRestore = time;
					
					const limeLeft = time - lastRestore;
					lastRestore = time;
					curHp = curHp + limeLeft * restoreOneSecond;
					cl('hp are regenerating');
					
					if (curHp >= maxHp) {
						cl('hp are full')
						curHp = maxHp;
						this.SET_IS_REGENERATING(false)
					}

					this.user.curhp = Math.floor(+curHp);
					this.user.last_restore = time;
					setHpLineStyle(curHp, maxHp);
				};
			};

			const setHpLineStyle = (curHp, maxHp) => {
				const curHpInPercent = (curHp / maxHp) * 100;
				const color =
					curHpInPercent < 33
						? "#993e3e"
						: curHpInPercent < 66
						? "#dddd42"
						: "green";

				this.hpLineStyle.width = (curHp / maxHp) * 100 + "%";
				this.hpLineStyle.backgroundColor = color;
			};


			curHp = this.user.curhp;
			maxHp = this.user.maxhp;
			if (curHp >= maxHp) {
				this.user.curhp = maxHp;
				setHpLineStyle(curHp, maxHp);
				return;
			}
			if (this.isRegenerating) {
				this.$options.HpRestore();
				return;
			}
			this.SET_IS_REGENERATING(true);

			// const restoreSpeed = 1;
			const minutesToMaxHp = 0.8;
			// const renderSpeed = 1 / 2;
			const renderSpeed = 1;
			const restoreOneSecond = maxHp / (minutesToMaxHp / 1) / 60;

			this.$options.HpRestore = hp(curHp, maxHp, lastRestore);
			this.$options.HpRestore();

			if (this.isRegenerating) {
				const timer = setInterval(() => {
					// cl(this.$options.HpRestore);
					this.$options.HpRestore();
					if (!this.isRegenerating) {
						clearInterval(timer);
					}
				}, 1000 / renderSpeed);
			}
		},
		...mapMutations(["SET_USER", 'SET_TEST', 'SET_IS_REGENERATING', 'SET_NEED_REGENERATION'])
	},

	computed: {
		...mapGetters(["user", "dbLog", 'isRegenerating']),
		...mapState(['needRegeneration'])
	},

	watch: {
		needRegeneration(newVal) {
			if (newVal) {
				// this.$options.HpRestore(getTimeSeconds());
				this.regeneration();
				this.SET_NEED_REGENERATION(false);
			}
		}
	},

	mounted() {
		this.regeneration();
	}
};
</script>

<style></style>
