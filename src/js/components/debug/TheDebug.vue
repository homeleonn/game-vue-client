<template>
	<div class="test">
		<button @click="add">Add new player</button>
		<button @click="changeName">changeName</button>
		<button @click="changeA">changeA</button>
		

		<div>{{ game }} {{ players }} {{counter}}</div>
		<div>{{ a }}</div>
	</div>
	<div class="debug" v-if="false">
		<h1 class="center">DEBUG</h1>
		<button @click="getAppData">Update</button>
		<div class="row">
			<div class="col col-3" v-for="(debugData, key) in appData?.server" :key="key"><!-- {{debugData}} --><!-- {{key}} -->
				<div v-if="key === 'userRepo'">
					<div v-for="(u, ufd) in debugData.users" :key="ufd" class="row rcol">
						<div v-for="(v, prop) in u.attr" :key="prop" class="row">
							<div v-if="prop === 'packItems'"><!-- {{v}} -->
									<hr>
								<div v-for="(iv, iprop) in v[Object.keys(v)[0]]" :key="iprop" class="row">
									<div class="col-md-8">{{iprop}}</div>
									<div class="col-md-4">{{iv}}</div>
								</div>
							</div>
							<div v-else class="row">
								<div class="col-md-8">{{prop}}</div>
								<div class="col-md-4">{{v}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- {{key}}{{debugData}} -->
</template>

<script>
import { setup, ref, reactive, getCurrentInstance } from 'vue';

class Player {
	constructor(name) {
		this.name = name;
	}
}

class Game {
	constructor(name) {
		this.name = name;
		this.players = reactive([]);
		// this.players = [];
	}

	addPlayer(player) {
		this.players.unshift(player)
	}
}

export default {
	setup() {
		const game = new Game('Test');
		const a = [1];
		// const a = reactive([1]);
		// const game = reactive(new Game('Test'));
		let counter = ref(0);
		console.log(getCurrentInstance());

		function add() {
			game.addPlayer(new Player('Test-' + ++counter.value));
		}

		function changeName() {
			game.players[0].name = 'Woow';
			game.name = '111'
			a[0] = 3;
			// counter = counter + 1;
		}

		function changeA() {
			a[1] = 4;
		}

		return {
			a,
			game,
			players: game.players,
			add,
			changeName,
			changeA,
			counter: counter
		}
	}



	// inject: [
	// 	'api',
	// 	'apiSubscribe'
	// ],

	// data() {
	// 	return {
	// 		appData: null
	// 	}
	// },

	// mounted() {
	// 	this.apiSubscribe([
	// 		'debug'
	// 	], this);
	// },

	// computed: {
		
	// },

	// updated() {
	// },

	// methods: {
	// 	debug(appData) {
	// 		this.appData = appData;
	// 	},

	// 	getAppData() {
	// 		this.api.doAction('debug');
	// 	}
	// },
}


</script>

<style lang="scss" scoped>

</style>