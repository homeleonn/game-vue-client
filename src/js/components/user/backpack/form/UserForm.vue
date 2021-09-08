<template>
	<div class="col-md-5">
		<div class="row">
			<div class="user-form col-md-7">
				<div class="row">
					<div class="user-form__left">
						<div class="user-form__slot" v-for="(item, idx) in ['head', 'rhand', 'chest']" :key="idx">
							<pack-item :item="getSlot(item)" usage="Снять"></pack-item>
						</div>
					</div>
					<div class="user-form__image"><img :src="'/img/images/0.png'"></div>
					<div class="user-form__right">
						<div class="user-form__slot" v-for="(item, idx) in ['gloves', 'lhand', 'legs', 'feet']" :key="idx">
							<pack-item :item="getSlot(item)" usage="Снять"></pack-item>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-5 user-info">
				<table>
					<tr v-for="i in userInfo" :key="i">
						<td>{{ i.k }}</td>
						<td>{{ i.v }}</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>
			<!-- <div class="__slot"><img :src="getSlot('ear').image" /></div>
				<div class="__slot"><img :src="getSlot('neck').image" /></div>
				<div class="row">
					<div class="col-md-4 __slot"><img :src="getSlot('finger').image" /></div>
					<div class="col-md-4 __slot"><img :src="getSlot('finger').image" /></div>
					<div class="col-md-4 __slot"><img :src="getSlot('finger').image" /></div>
				</div> -->
<script>
import PackItem from '../items/PackItem';
import { mapGetters } from 'vuex'
import { userInfo } from '@/js/lang/ru';

export default {
	components: { PackItem },

	props: {
		userImage: String,
		items: Array
	},

	data() {
		return {
			slots: [
				{
					isFullSlot: true,
					slots: [

					]
				}
			],
			info: ['power', 'critical', 'evasion', 'stamina', 'win', 'defeat', 'draw', 'exp', 'gold'],
		}
	},

	computed: {
		...mapGetters(['user']),
		userInfo() {
			// return this.info.map(i => { k: userInfo[i], v: this.user[i] }`${userInfo[i]}: ${this.user[i]}`);
			return this.info.map(i => ({ k: userInfo[i], v: this.user[i] }));
		}
	},

	mounted() {
		// cl(this.items);
	},

	watch: {
		items(items) {
			// cl(items);
		}
	},

	methods: {
		// рубаху убрать
		getSlot(bodyPart) {
			const parts = [bodyPart];
			if (bodyPart === 'rhand') {
				parts.push('dblhand');
			}

			const item = this.items.filter(item => parts.includes(item.body_part));
			return item[0] ? item[0] : { image: `/img/slots/${bodyPart}.png` };
		},
	}
}
</script>

<style lang="scss">

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
