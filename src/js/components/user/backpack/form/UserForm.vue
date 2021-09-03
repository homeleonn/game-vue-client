<template>
	<div class="user-form col-md-5">
		<div class="row">
			<div class="user-form__left">
				<div class="user-form__slot" v-for="(item, idx) in ['head', 'lrhand', 'chest', 'underwear']" :key="idx">
					<pack-item :item="getSlot(item)" usage="Снять"></pack-item>
				</div>
			</div>
			<div class="user-form__image"><img :src="'/img/images/0.png'"></div>
			<div class="user-form__right">
				<div class="user-form__slot" v-for="(item, idx) in ['gloves', 'lhand', 'legs', 'feet']" :key="idx">
					<pack-item :item="getSlot(item)"></pack-item>
				</div>
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
			]
		}
	},

	computed: {
		
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
			const item = this.items.filter(item => item.body_part === bodyPart);
			return item[0] ? item[0] : { image: `/img/slots/${bodyPart}.png` };
		},
	}
}
</script>

<style lang="scss">

.user-form {

> .row {
	> * {
		line-height: 0;
		width: 60px;
	}
}

> .row {
	width: 220px;
	margin-left: 20px;
}

&__left, &__right, &__slot	{
	width: 60px;
}

&__image {
	width: 100px !important;
}

&__slot {
	height: 60px;
	border: 1px solid #d5d5d5;
	// border-top: transparent;
	// border-right: transparent;
}

}
</style>