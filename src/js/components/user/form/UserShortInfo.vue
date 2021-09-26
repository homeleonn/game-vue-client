<template>
	<div class="info-wrapper" :class="{shrink}">
		<div class="info">
			<!-- <div class="align"><img src="img/aligns/99.gif" /></div> -->
			<div class="clan"><img src="img/clans/developers.png" /></div>
			<div class="login">{{ user.login ?? user.name }}[{{ user.level }}]</div>
		</div>
		<div class="hp-wrapper">
			<div class="hp-back">
				<div class="hp-line" :style="hpLineStyle"></div>
			</div>
			<div class="hp">{{ user.curhp }} / {{ user.maxhp }}</div><span class="icon-spin3 active" v-if="isRegenerating"></span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		user: Object,
		isRegenerating: {
			default: () => false
		},
		shrink: {
			type: Boolean,
			default: () => false
		},
	},

	computed: {
		hp() {
			return (this.user.curhp <= 0 ? 0 : this.user.curhp) + ' / ' + this.user.maxhp;
		},

		hpLineStyle() {
			return setHpLineStyle(this.user.curhp, this.user.maxhp);
		}
	}
}	
</script>

<style lang="scss">
.info-wrapper {
	&.shrink {
		font-size: 12px;

		img {
			max-width: 10px;
		}

		.hp-wrapper {
			margin-bottom: 10px;
			.hp-back, .hp-line {
				border-radius: 0;
				height: 3px;
			}

			.hp {
				display: none;	
			}
		}
	}

	.clan {
		img {
			// width: 15px !important;
		}
	}
}
.hp-wrapper {
	margin: 0 auto;
}
</style>