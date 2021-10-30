<template>
	<template v-if="apiReady">
		<game-header @setCurComp="setCurComp"></game-header>
		<div class="main">
			<main-modal></main-modal>
			<user-supplies></user-supplies>
			<!-- <keep-alive> -->
			<component :is="currentMainComponent" @chloc="changeLocation" @setCurComp="setCurComp"></component>
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
// import GameFight from "./fight/GameFight";
// import GameFight1 from "./fight/GameFight1";
import GameFight2 from "./fight/GameFight2";
import FightStats from "./fight/FightStats";
import MainModal from "./modal/MainModal";
import Api from "../api/api.js";

// const UserBackpack = defineAsyncComponent(() =>
//	 import('./user/backpack/UserBackpack.vue')
// )

const TheHunting = defineAsyncComponent(() =>
	import('./hunt/TheHunting.vue')
)

const api = new Api();

export default {
	components: { GameHeader, GameFooter, LocationWrapper, MainModal, UserBackpack, TheHunting, TheDebug, GameFight2, UserSupplies, FightStats },
	data() {
		return {
			currentMainComponent: 'UserBackpack',
			// currentMainComponent: "GameFight2",
			// currentMainComponent: "TheHunting",
			// currentMainComponent: "TheDebug",
			// currentMainComponent: null,
			// apiReady: true
			apiReady: false
		};
	},

	mounted() {
		if (!this.apiReady) {
			api.init();
		}
	},

	provide() {
		return {
			api,
			apiSubscribe: this.apiSubscribe
		};
	},

	methods: {
		...mapMutations([
			"SET_CSRF",
			"SET_USER",
			"SET_LOCATION",
			"SET_CLOSEST_LOCATIONS",
			"SET_LOCATION_USERS"
		]),

		event(event, data) {
			cl(event, data);
		},

		setCurComp(compName) {
			cl(compName);
			this.currentMainComponent = compName;
		},

		changeLocation(locId) {
			api.doAction('chloc', locId);
		},

		sendMessage(message) {
			api.doAction('sendMessage', message);
		},

		scrollDown() {
			messages.scrollTop = messages.scrollHeight;
		},

		append(message) {
			messages.innerHTML += `<div class="msg">${date(
				"H:i:s"
			)} ${message}</div>`;
		},

		// api interaction
		me(user) {
			this.apiReady = true;
			this.SET_USER(user);
		},

		loc(loc) {
			this.SET_LOCATION(loc.loc);
			this.SET_LOCATION_USERS(loc.locUsers);
			this.SET_CLOSEST_LOCATIONS(loc.closestLocs);
		},

		addLocUser(user) {
			this.ADD_LOCATION_USER(user);
		},

		leaveLocUser(userId) {
			this.REMOVE_LOCATION_USER(userId);
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

		apiSubscribe(events, ctx) {
			if (!Array.isArray(events)) {
				Object.keys(events).forEach(event => { api.subscribe(event, events[event], events) });
			} else {
				events.forEach(event => api.subscribe(event, ctx[event], ctx));
			}
		}
	},

	computed: {
		...mapGetters(["test", 'user']),

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

		api.subscribeToWS(
			"open",
			() => {
				// this.apiReady = true;
			},
			this
		);

		// this.$store.watch(
		// 	(state, getters) => getters.test,
		// 	() => {
		// 		console.log("update");
		// 	}
		// );


		// cl(this.$store);

		// this.$store.watch(
  //     () => this.$store.state.test,
  //     (q) => {
  //       cl(q);
  //     }
  //   )


    // this.$store.watch(() => this.$store.getters.SEND_LOGIN, Login => { console.log('watched: ', Login) })
	}
};
</script>

<style lang="scss">
.main {
	position: relative;
	padding-left: 70px;
}
</style>
