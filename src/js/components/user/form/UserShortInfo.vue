<template>
	<div class="info-wrapper" :class="{shrink}">
		<div class="info">
			<div class="tendency" v-if="user.tendency_name">
				<img :src="`/img/tendencies/${user.tendency_img}`" :title="user.tendency_name" />
			</div>
			<div class="clan" v-if="user.clan_name">
				<img :src="`/img/clans/${user.clan_img}`" :title="user.clan_name" />
			</div>
			<div class="login">{{ user.login ?? user.name }}[{{ user.level }}]<span class="icon-ok"></span></div>
		</div>
		<div class="hp-wrapper">
			<div class="hp-back">
				<div class="hp-line" :style="hpLineStyle"></div>
			</div>
			<div class="hp">{{ hp }}</div><span class="icon-spin3 active" v-if="isRegenerating"></span>
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
.icon-ok {
	display: none;
}
.active .info-wrapper .icon-ok {
	display: inline;
}
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
