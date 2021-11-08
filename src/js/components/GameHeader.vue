<template>
	<header>
		<div
			class="avatar"
			:style="{ backgroundImage: `url(img/images/${user.sex}.png)` }"
			title="Персонаж"
			@click="getUserInfo()"
		></div>
		<user-short-info
			:user="user"
			:hpLineStyle="hpLineStyle"
		></user-short-info>
		<!-- <button class="reset-hp" @click="reset">сбросить хп</button> -->
		<div class="top-panel flex" :class="{ disabled: user.fight }">
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
			<div><img src="img/other/quest.jpg" title="Квесты" @click="$emit('setCurComp', 'QuestList')" /></div>
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
import { tokenUrl } from '@/../.env.js';

export default {
	name: "GameHeader",
	components: { UserShortInfo },

	data() {
		return {
			hpLineStyle: {},
			isRegenerating: false,
			maxHpChanged: false,
			HpRestore: null,
		};
	},

	methods: {
		stopRegen() {
			this.isRegenerating = false;
		},

		regeneration(curHp = 180, maxHp = 200, lastRestore) {
			const hp = (curHp, maxHp, lastRestore) => {
				return (lastRestoreTime = null) => {
					if (this.user.fight) this.stopRegen();
					this.isRegenerating = true;
					maxHp = this.user.maxhp;
					const time = getTimeSeconds();

					if (!lastRestore) lastRestore = time;

					curHp = curHp + (time - lastRestore) * restoreOneSecond;
					lastRestore = time;

					if (curHp >= maxHp) curHp = maxHp;

					this.user.curhp = Math.floor(+curHp);
					this.user.last_restore = time;
					this.hpLineStyle = setHpLineStyle(curHp, maxHp);

					if (curHp >= maxHp) {
						this.stopRegen();
					}
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
				return this.HpRestore();
			}

			const restoreSpeed = 1;
			const minutesToMaxHp = 1;
			const renderSpeed = 1 / 2;
			const restoreOneSecond = maxHp / (minutesToMaxHp / restoreSpeed) / 60;

			this.HpRestore = hp(curHp, maxHp, lastRestore);
			this.HpRestore();

			if (this.isRegenerating) {
				const timer = setInterval(() => {
					this.HpRestore();
					if (!this.isRegenerating) {
						clearInterval(timer);
					}
				}, 1000 / renderSpeed);
			}
		},

		getUserInfo() {
			window.open(`${this.host}/user/${this.user.id}/info`, '_blank').focus();
		},


	},

	computed: {
		...mapGetters(["user", "dbLog"]),
		...mapState(['host']),
	},

	mounted() {
		this.regeneration();

		this.$store.watch(
			() => this.$store.state.user.curhp,
			() => {
				this.regeneration()
			},
		);

		this.$store.watch(
			() => this.$store.state.user.maxhp,
			() => {
				this.regeneration()
			},
		);
	}
};
</script>

<style>
.top-panel.disabled {
	opacity: .4;
}
</style>
