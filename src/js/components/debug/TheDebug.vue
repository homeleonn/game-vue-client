<template>
	<div class="debug">
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
export default {
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

		this.getAppData();
	},

	computed: {
		
	},

	methods: {
		debug(appData) {
			this.appData = appData;
		},

		getAppData() {
			this.api.doAction('debug');
		}
	}
}
</script>