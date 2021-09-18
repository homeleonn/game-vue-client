<template>
	<div
		class="user-form-wrapper col-md-5"
		:class="{'fight': isFight}"
	>
		<div class="flex">
			<div v-if="isFight">
				<user-short-info
					:user="user"
					:hpLineStyle="hpLineStyle"
				></user-short-info>
			</div>
			<div class="user-form">
				<div class="row">
					<div class="user-form__left">
						<div class="user-form__slot" v-for="(item, idx) in ['head', 'rhand', 'chest']" :key="idx">
							<pack-item :item="getSlot(item)" usage="Снять"></pack-item>
						</div>
					</div>
					<div class="user-form__image"><img :src="image"></div>
					<div class="user-form__right">
						<div class="user-form__slot" v-for="(item, idx) in ['gloves', 'lhand', 'legs', 'feet']" :key="idx">
							<pack-item :item="getSlot(item)" usage="Снять"></pack-item>
						</div>
					</div>
				</div>
			</div>
			<user-info :info="userInfo"></user-info>
		</div>
	</div>
</template>
<script>
import PackItem from '../backpack/items/PackItem';
import UserInfo from './UserInfo';
import UserShortInfo from './UserShortInfo'
// import { mapGetters } from 'vuex'
import { userInfo } from '@/js/lang/ru';

export default {
	components: { PackItem, UserInfo, UserShortInfo },

	props: {
		user: Object,
		items: Array,
		info: {
			type: Array,
			required: false
		},
		isFight: Boolean,
	},

	data() {
		return {
		}
	},

	computed: {
		// ...mapGetters(['user']),
		userInfo() {
			const formattedInfo = this.setLangInfo(this.getLangInfoKeys, this.user);

			if (formattedInfo.length > 1) {
				formattedInfo.splice(1, 0, { k: 'Урон', v: `+${this.user.min_damage + this.user.extra_min_damage}...+${this.user.max_damage + this.user.extra_max_damage}` });
			}
			return formattedInfo;
		},

		fightUserInfo() {
			return this.setLangInfo(this.getLangInfoKeys, this.fightUser);
		},

		getLangInfoKeys() {
			return this.info ? this.info : ['power', 'critical', 'evasion', 'stamina', 'win', 'defeat', 'draw', 'exp', 'gold'];
		},

		image() {
			return 'img/images/' + (this.user.image ?? this.user.sex + '.png');
		},

		hpLineStyle() {
			return setHpLineStyle(this.user.curhp, this.user.maxhp);
		}

	},

	methods: {
		getSlot(bodyPart) {
			const parts = [bodyPart];
			if (bodyPart === 'rhand') {
				parts.push('dblhand');
			}

			const item = this.items.filter(item => parts.includes(item.body_part));
			return item[0] ? item[0] : { image: `/img/slots/${bodyPart}.png` };
		},

		setLangInfo(keys, user) {
			return keys.map(i => ({ k: userInfo[i], v: user[i] }));
		},
	},

	mounted() {
		// cl(this.info ?? 1);
	}
}
</script>

<style lang="scss">

.user-form-wrapper {
	> .flex {
		justify-content: center;

		> * {
			margin: 0 10px;
		}
	}

	&.fight > .flex {
		flex-direction: column;
		align-items: center;

		> * {
			margin: 10px;
		}
	}
}

.user-form {

> .row {
	width: 220px;
	margin: 0 auto;

	> * {
		line-height: 0;
		width: 60px;
	}
}

&__left, &__right, &__slot	{
	width: 60px;
}

&__image {
	width: 100px !important;
}

&__slot {
	height: 60px;
	// border-top: transparent;
	// border-right: transparent;
}

}


.user-info {
	table {
		width: 90%;

		> tr:nth-child(even) {
			background: #f5f5f5;
		}

		tr td:last-child {
			text-align: right;
		}
	}
}
</style>
