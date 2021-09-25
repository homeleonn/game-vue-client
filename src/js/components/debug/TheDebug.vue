<template>
	<div class="fighters">
		<div class="fighter-wrapper left">
			<div class="fighter"></div>
			<div class="damage active"></div>
		</div>
		<div class="fighter-wrapper right">
			<div class="fighter"></div>
			<div class="damage active"></div>
		</div>
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

		// this.getAppData();

		// initStance(_('.fighter'));
		// setInterval(() => {
		// 	hit('.left .fighter', HIT_TYPES.EVASION);
		// 	hit('.right .fighter', HIT_TYPES.BLOCK);
		// }, 2000);
	},

	computed: {
		
	},

	updated() {
		clearInterval(timerId);
		cl(1);
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

const HIT_TYPES = {
	HAND: 3,
	LEG: 7,
	EVASION: 4,
	EVASION1: 2,
	BLOCK: 1,
};

const HIT_STEPS = {
	[HIT_TYPES.HAND]: 3,
	[HIT_TYPES.LEG]: 5,
	[HIT_TYPES.EVASION]: 4,
	[HIT_TYPES.EVASION1]: 5,
	[HIT_TYPES.BLOCK]: 4,
};

// cl(HIT_STEPS, HIT_STEPS[HIT_TYPES.HAND]);


function hit(_class, type) {
	let steps = HIT_STEPS[type];
	if (!steps) steps = 0;
	steps--;
	const y = (type - 1) * -200;
	const stepSize = 177;
	let step = 0;
	let initX = 0;
	if (type === HIT_TYPES.HAND) {
		initX = -stepSize
		steps--;
	}
	let x = initX;
	const _el = _(_class);
	setStance(_el, x, y);
	if (type === HIT_TYPES.EVASION) {
		_el.parent().children('.damage').html('<span style="color: lightgreen;">Уворот</span>')
	} else if (type === HIT_TYPES.BLOCK) {
		_el.parent().children('.damage').html('<span style="color: black;">Блок</span>')
	}

	const stepAction = (to) => {
		step++;
		x += to ? -stepSize : stepSize;
		setStance(_el, x, y);
	}

	let timerId = setInterval(() => {
		if (step >= steps) {
			initStance(_el)
			clearInterval(timerId);
			return;
		}
		stepAction(step <= steps);
	}, 200)
}

function initStance(el) {
	setStance(el, 0, -200 * 2)
}

function setStance(el, x, y) {
	el.css('backgroundPosition', `${x}px ${y}px`);
}


</script>

<style lang="scss">
.fighters {
	position: relative;
	margin-top: 30px;
}

.fighter-wrapper {
	position: relative;
	display: inline-block;

	&.right {
		left: -50px;
	}
	
	&, .fighter {
		width: 170px;
		height: 197px;
	}

	.fighter {
		top: 0;
		position: absolute;
		border: 0px transparent solid;
		background-image: url('/img/fight/ken.png');
		background-size: 1220px;
	}

	&.right .fighter {
		transform: rotateY(180deg); 
	}

	.damage {
		position: relative;
		font-weight: bold;
		font-size: 30px;
		color: white;
		top: 30%;
		// left: 5%;
		text-align: center;
		margin-top: -10px;
		margin-left: -10px;
		z-index: 999;
		// background: rgba(0, 0, 0, .1);
		// display: none;

		&.active {
			display: block;
			animation: flyDamage 2s linear infinite;
		}
	}
}

@keyframes flyDamage {
    from {
        top: 30%;
        opacity: 1;
    }
    to {
        top: -20px;
        opacity: .8;
    }
}
</style>