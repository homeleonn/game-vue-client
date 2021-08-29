<template>
	<game-header @setCurComp="setCurComp"></game-header>
	<!-- <location-wrapper @chloc="changeLocation"></location-wrapper> -->
	<keep-alive>
		<component 
			:is="currentMainComponent" 
			@chloc="changeLocation"
			>
			
		</component>
	</keep-alive>

	<game-footer @sendMessage="sendMessage"></game-footer>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapMutations } from 'vuex'
import GameHeader from './GameHeader'
import GameFooter from './GameFooter'
import LocationWrapper from './LocationWrapper'
// import UserBackpack from './user/UserBackpack'
import Api from '../api/api.js';

const UserBackpack = defineAsyncComponent(() =>
  import('./user/backpack/UserBackpack.vue')
)

const api = new Api();

export default { 
	data() {
		return {
			currentMainComponent: 'LocationWrapper',
			// currentMainComponent: 'UserBackpack',
			// currentMainComponent: null,
			apiReady: false
		}
	},

	provide() {
		return {
			api,
			apiSubscribe: this.apiSubscribe
		}
	},

	methods: {
		...mapMutations([
			'SET_CSRF', 
			'SET_USER', 
			'SET_LOCATION', 
			'SET_CLOSEST_LOCATIONS', 
			'SET_LOCATION_USERS'
		]),

		event(event, data) {
			cl(event, data);
		},

		setCurComp(compName) {
			cl(compName);
			this.currentMainComponent = compName;
		},

		changeLocation(locId) {
			api.chloc(locId);
		},

		sendMessage(message) {
			api.sendMessage(message);
		},

		scrollDown() {
			messages.scrollTop = messages.scrollHeight;
		},

		append(message) {
			messages.innerHTML += `<div class="msg">${date('H:i:s')} ${message}</div>`;
		},


		// api interaction
		me(user) {
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
				case 'string': this.append(message); break;
				case 'object': this.append(`${message.from}: ${message.text}`); break;
			}
			
			this.scrollDown();
		},

		apiSubscribe(events, ctx) {
			events.forEach(event => api.subscribe(event, ctx[event], ctx)
		);
		}
	},

	computed: {
		currentProps() {
			switch (currentMainComponent) {
				case 'LocationWrapper': return 1;
			}

			return 1;
		}
	},

	watch: {
		apiReady() {
			// if (this.apiReady) {
				// this.currentMainComponent = 'UserBackpack';
			// }
		}
	},

	mounted() {
		api.init();
		// cl(this.$server);
		// this.$store.dispatch('init');
		// this.SET_CSRF(document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
	},

	created() {
		this.apiSubscribe([
			'me', 
			'loc', 
			'addLocUser', 
			'leaveLocUser', 
			'message'
		], this);

		api.subscribeToWS('open', () => { this.apiReady = true; }, this)
	},

	components: { GameHeader, GameFooter, LocationWrapper, UserBackpack },
};
</script>

<style lang="scss">

.center {
	text-align: center;
}

</style>