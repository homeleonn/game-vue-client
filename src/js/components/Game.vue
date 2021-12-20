<template>
	<template v-if="apiReady">
		<game-header @setCurComp="setCurComp"></game-header>
		<div class="main">
			<main-modal></main-modal>
			<user-supplies></user-supplies>
			<npc-view v-if="npc" :npc="npc"></npc-view>
			<!-- <keep-alive> -->
			<component v-else :is="currentMainComponent" @chloc="changeLocation" @setCurComp="setCurComp"></component>
			<!-- </keep-alive> -->
		</div>
		<game-footer @sendMessage="sendMessage" @setCurComp="setCurComp"></game-footer>
	</template>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapMutations, mapGetters } from "vuex";
import GameHeader from "./GameHeader";
import GameFooter from "./GameFooter";
import LocationWrapper from "./LocationWrapper";
import UserBackpack from "./user/backpack/UserBackpack";
import UserSupplies from "./user/UserSupplies";
import TheDebug from "./debug/TheDebug";
import GameFight2 from "./fight/GameFight2";
import FightStats from "./fight/FightStats";
import MainModal from "./modal/MainModal";
import NpcView from "./npc/NpcView";
import QuestList from "./user/quest/QuestList";
import Api from "../api/api.js";
import { tokenUrl } from '@/../.env.js';

// const UserBackpack = defineAsyncComponent(() =>
//	 import('./user/backpack/UserBackpack.vue')
// )

const TheHunting = defineAsyncComponent(() =>
	import('./hunt/TheHunting.vue')
)

const api = new Api();

export default {
	components: { GameHeader, GameFooter, LocationWrapper, MainModal, UserBackpack, TheHunting, TheDebug, GameFight2, UserSupplies, FightStats, NpcView, QuestList },
	data() {
		return {
			currentMainComponent: 'LocationWrapper',
			apiReady: false,
			timer: null,
			npc: null,
		};
	},

	mounted() {
		if (!this.apiReady) {
			api.init();
		}

		this.$store.state.host = new URL(tokenUrl).origin;
	},

	provide() {
		return {
			api,
			apiSubscribe: this.apiSubscribe,
			talkToNpc: this.talkToNpc,
		};
	},

	methods: {
		...mapMutations([
			"SET_CSRF",
			"SET_USER",
			"SET_LOCATION",
			"SET_CLOSEST_LOCATIONS",
			"SET_LOCATION_USERS",
			"ADD_LOCATION_USER",
			"REMOVE_LOCATION_USER",
		]),

		event(event, data) {
			console.log(event, data);
		},

		setCurComp(compName) {
			if (this.user.fight) return;
			console.log(compName);
			this.npc = null;
			this.currentMainComponent = compName;
		},

		changeLocation(locId) {
			this.npc = null;
			api.doAction('chloc', locId, ({ trans_time, trans_timeout }) => {
				this.$store.commit('SET_TIME', trans_time);
				this.user.trans_time = trans_time;
				this.user.trans_timeout = trans_timeout;
				this.startTimeTimer();
			});
		},

		sendMessage(message) {
			api.doAction('sendMessage', message);
		},

		scrollDown() {
			messages.scrollTop = messages.scrollHeight;
		},

		append(message) {
			messages.innerHTML += `<div class="msg">
				<div class="msg-date">${date("H:i")}</div>
				<div class="msg-text">${message}</div>
			</div>`;
		},

		// api interaction
		me(user) {
			this.apiReady = true;
			this.SET_USER(user);
			if (user.fight) {
				this.currentMainComponent = 'GameFight2';
			}
		},

		loc(loc) {
			this.SET_LOCATION(loc.loc);
			this.SET_LOCATION_USERS(loc.locUsers);
			this.SET_CLOSEST_LOCATIONS(loc.closestLocs);
		},

		addLocUser(user) {
			this.ADD_LOCATION_USER(user);
		},

		leaveLocUser({ id }) {
			this.REMOVE_LOCATION_USER(id);
		},

		message(message) {
			switch (typeof message) {
				case "string":
					this.append(message);
					break;
				case "object":
					this.append(`${message.from}: ${message.text}`);
					break;
			}

			this.scrollDown();
		},

		apiSubscribe(events, ctx, once = false) {
			if (!Array.isArray(events)) {
				ctx = events;
				once = false;
				events = Object.keys(events);
			}

			events.forEach(event => api.subscribe(event, ctx[event], ctx, once));
		},

		startTimeTimer() {
			clearTimeout(this.timer);
			if (this.isWalkingTimeout) return;
			this.timer = setTimeout(() => {
				this.$store.commit('SET_TIME', this.time + 1);
			}, 1000);
		},

		talkToNpc(id) {
			api.doAction('talkToNpc', id, npc => {
				this.npc = npc;
			});
		}
	},

	computed: {
		...mapGetters(['user']),

		time() {
			return this.$store.state.time;
		},

		isWalkingTimeout() {
			return !this.user.trans_timeout || this.time > this.user.trans_timeout;
		},

		currentProps() {
			switch (currentMainComponent) {
				case "LocationWrapper":
					return 1;
			}

			return 1;
		}
	},

	watch: {
		apiReady() {
			// if (this.apiReady) {
			// this.currentMainComponent = 'UserBackpack';
			// }
		},
	},

	created() {
		this.apiSubscribe(
			["me", "loc", "addLocUser", "leaveLocUser", "message"],
			this
		);

		this.apiSubscribe({
			time: (time) => {
				this.$store.commit('SET_TIME', time);
				if (time < this.user.trans_timeout) {
					this.startTimeTimer();
				}
			},

			error: error => this.$store.commit('SET_MODAL', error),

			drop: drop => drop.forEach(d => {
				this.message(`<b>${d.npc_name} погиб и что-то выронил. Получено: ${d.name} ${d.count} шт.</b>`);
			})
		});

		api.subscribeToWS(
			"open",
			() => {
				// this.apiReady = true;
			},
			this
		);

		this.$store.watch(
      () => this.$store.state.time,
      () => this.startTimeTimer()
    )
	}
};
</script>

<style lang="scss">
.main {
	position: relative;
	padding-left: 70px;
}
</style>
