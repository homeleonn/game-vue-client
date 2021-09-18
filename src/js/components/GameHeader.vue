<template>
	<header>
		<div
			class="avatar"
			style="background-image: url('img/images/0.png')"
			title="Персонаж"
		></div>
		<user-short-info
			:user="user"
			:hpLineStyle="hpLineStyle"
		></user-short-info>
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
			<div><img src="img/other/fight.jpg" title="Бои" @click="$emit('setCurComp', 'TheHunting')" /></div>
			<div><img src="img/other/quest.jpg" title="Квесты" /></div>
			<!-- <div><img src="img/other/info.jpg" title="Анкета" /></div> -->
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
import UserShortInfo from './user/form/UserShortInfo'

export default {
	name: "GameHeader",
	components: { UserShortInfo },

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
			return;
			const hp = (curHp, maxHp, lastRestore) => {
				return (lastRestoreTime = null) => {
					maxHp = this.user.maxhp;
					const time = getTimeSeconds();
					
					if (!lastRestore) lastRestore = time;
					
					const limeLeft = time - lastRestore;
					lastRestore = time;
					curHp = curHp + limeLeft * restoreOneSecond;
					// cl('hp are regenerating');
					
					if (curHp >= maxHp) {
						// cl('hp are full')
						curHp = maxHp;
						this.SET_IS_REGENERATING(false)
					}

					this.user.curhp = Math.floor(+curHp);
					this.user.last_restore = time;
					this.hpLineStyle = setHpLineStyle(curHp, maxHp);
				};
			};


			this.hpLineStyle = setHpLineStyle(curHp, maxHp);

			curHp = this.user.curhp;
			maxHp = this.user.maxhp;
			if (curHp >= maxHp) {
				this.user.curhp = maxHp;
				this.hpLineStyle = setHpLineStyle(curHp, maxHp);
				return;
			}
			if (this.isRegenerating) {
				this.$options.HpRestore();
				return;
			}
			this.SET_IS_REGENERATING(true);

			// const restoreSpeed = 1;
			const minutesToMaxHp = 5;
			const renderSpeed = 1 / 2;
			// const renderSpeed = 1;
			const restoreOneSecond = maxHp / (minutesToMaxHp / 1) / 60;

			this.$options.HpRestore = hp(curHp, maxHp, lastRestore);
			this.$options.HpRestore();

			if (this.isRegenerating) {
				const timer = setInterval(() => {
					this.$options.HpRestore();
					if (!this.isRegenerating) {
						clearInterval(timer);
					}
				}, 1000 / renderSpeed);
			}
		},
		...mapMutations(["SET_USER", 'SET_TEST', 'SET_IS_REGENERATING', 'SET_NEED_REGENERATION']),

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
