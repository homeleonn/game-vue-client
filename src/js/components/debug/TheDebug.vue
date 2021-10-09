<template>
	<div class="test">
		<div>{{ game }} {{ players }} {{counter}}</div>
		<div>{{ a }}</div>
	</div>
	<div class="debug" v-if="true">
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
	<!-- {{fighters}}<br> -->
	<!-- {{teams}}<br> -->
	<div v-for="f in teams" :key="f">
		{{f}}
	</div>
	<button @click="addFighter({ id: 1, level: 1 })">addFighter</button>
	<button @click="changeFighter()">changeFighter</button>
</template>

<script>
// import { setup, ref, reactive } from 'vue';


export default {
	// setup() {
	// 	// cl({});
	// 	// const fighters = {};
	// 	const fighters = reactive({});
	// 	// const teams = reactive([{}, {}]);
	// 	const teams = [{}, {}];

	// 	function addFighter(fighter) {
	// 		fighters[fighter.id] = fighter;
	// 		teams[0][fighter.id] = fighter;
	// 	}

	// 	function changeFighter() {
	// 		fighters[1].level = 2;
	// 		// teams[0][1].level = 2;
	// 		cl(fighters, teams);
	// 	}

	// 	return {
	// 		fighters,
	// 		teams,
	// 		addFighter,
	// 		changeFighter,
	// 	}
	// }



	inject: [
		'api',
		'apiSubscribe'
	],

	data() {
		return {
			appData: null
		}
	},

	mounted() {
		this.apiSubscribe([
			'debug'
		], this);
	},

	computed: {
		
	},

	updated() {
	},

	methods: {
		debug(appData) {
			this.appData = appData;
		},

		getAppData() {
			this.api.doAction('debug');
		}
	},
}


</script>

<style lang="scss" scoped>

</style>