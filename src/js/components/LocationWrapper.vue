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
						:disabled="progress"
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
						:disabled="progress"
					></location-link>
				</div>
			</div>

			<div class="location-block characters">
				<div class="title">Персонажи</div>
				<div class="list">
					<location-link
						:closestLocations="closestLocations"
						type="character"
						:disabled="progress"
					></location-link>
				</div>
			</div>

			<div class="location-pass">
				<div class="title"></div>
				<div class="progressbar">
					<div class="progress" :style="{width: progress + '%'}"></div>
				</div>
				<div class="center" v-if="progress">{{ timerBoard }}</div>
				<div class="center">
					<div v-if="!progress">Переход возможен</div>
					<div v-else>До перехода осталось...</div>
				</div>
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
		fullTransitionTime: 0
	}),

	methods: {
		...mapMutations(["SET_ACTIVE_LOCATION"]),

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
			if (!this.user.trans_timeout || this.time > this.user.trans_timeout) return 0;

			const fullTimeTransition = this.user.trans_timeout - this.user.trans_time;
			const timeleft = this.time - this.user.trans_time;

			const progress = 100 - timeleft / fullTimeTransition * 100;

			return progress > 100 ? 100 : progress;
		},

		timerBoard() {
			return timer(this.user.trans_timeout - this.time);
		},

		time() {
			return this.$store.state.time;
		}
	},

	mounted() {
		this.apiSubscribe({
			chloc: ({ trans_time, trans_timeout }) => {
				this.$store.commit('SET_TIME', trans_time);
				this.user.trans_time = trans_time;
				this.user.trans_timeout = trans_timeout;
			},
		});
	},

	beforeUnmount() {
		clearInterval(this.timer);
	}
};
</script>

<style>
.location-select .location-pass .progressbar .progress {
	width: 50%;
}
</style>
