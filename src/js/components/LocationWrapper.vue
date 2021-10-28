<template>
	<div id="location-wrapper">
		<div class="location">
			<div class="name">{{ location.name }}</div>
			<div class="svg-wrapper">
				<svg ref="svg">
					<template v-for="(coords, index) in location.loc_coords" :key="index">
						<polygon
							:class="[`loc-${index}`, { active: activeLocation == index }]"
							:points="coords"
							@mouseenter="SET_ACTIVE_LOCATION(index)"
							@mouseleave="SET_ACTIVE_LOCATION(false)"
							@click="$emit('chloc', index)"
						/>
					</template>
				</svg>
			</div>
			<img :src="locImg" class="map" />
		</div>

		<div class="location-select">
			<div class="location-block locations">
				<div class="title">Локации</div>
				<div class="list">
					<location-link
						:closestLocations="closestLocations"
						type="location"
						@chloc="id => $emit('chloc', id)"
					></location-link>
				</div>
			</div>

			<div class="location-block objects">
				<div class="title">Объекты</div>
				<div class="list">
					<location-link
						:closestLocations="closestLocations"
						type="object"
						@chloc="id => $emit('chloc', id)"
					></location-link>
				</div>
			</div>

			<div class="location-block characters">
				<div class="title">Персонажи</div>
				<div class="list">
					<location-link
						:closestLocations="closestLocations"
						type="character"
						@chloc="id => $emit('chloc', id)"
					></location-link>
				</div>
			</div>

			<div class="location-pass">
				<div class="title"></div>
				<div class="progressbar">
					<div class="progress" :style="{width: progress + '%'}"></div>
				</div>
				<div class="center" v-if="progress">{{ timerBoard }}</div>
			</div>
			<div class="center">
				<div v-if="!progress">Переход возможен</div>
				<div v-else>Шагаем...</div>
			</div>
		</div>

		<span class="loader"></span>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import LocationLink from "./location/LocationLink";

export default {
	name: "location-wrapper",
	components: { LocationLink },

	emits: ["chloc"],
	inject: ['apiSubscribe'],

	data: () => ({
		// activeLocation: false
		time: 0,
		timer: null,
		fullTransitionTime: 0
	}),

	methods: {
		...mapMutations(["SET_ACTIVE_LOCATION"]),

		startTimer() {
			// cl('starttimer')
			clearInterval(this.timer);
			this.timer = setInterval(() => {
				this.time++;
			}, 1000);
		},

		getFullTimeTransition() {
			return this.user.trans_timeout - this.user.trans_time;
		},
	},

	computed: {
		...mapGetters(["location", "closestLocations", "activeLocation", 'user']),

		locImg() {
			return this.location.image == null
							? "img/other/no-image.png"
							: "img/locations/" + this.location.image;
		},

		progress() {
			if (!this.user.trans_timeout || this.time > this.user.trans_timeout) {
				clearInterval(this.timer);
				return 0;
			}

			const fullTimeTransition = this.user.trans_timeout - this.user.trans_time;
			const timeleft = this.time - this.user.trans_time;

			return 100 - timeleft / fullTimeTransition * 100;
		},

		timerBoard() {
			return timer(this.user.trans_timeout - this.time);
		}
	},

	mounted() {
		this.apiSubscribe({
			chloc: ({ trans_time, trans_timeout }) => {
				this.time = trans_time;
				this.user.trans_time = trans_time;
				this.user.trans_timeout = trans_timeout;
				this.startTimer();
			},

			time: (time) => {
				this.time = time;
				if (this.time > this.user.trans_timeout) return;
				this.startTimer();
			}
		});
	}
};
</script>

<style>
.location-select .location-pass .progressbar .progress {
	width: 50%;
}
</style>
