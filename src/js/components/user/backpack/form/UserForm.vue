<template>
	<div class="user-form col-md-5">
		<div class="row">
			<div class="user-form__left">
				<div class="user-form__slot"><pack-item :item="getSlot('head')"></pack-item></div>
				<div class="user-form__slot"><pack-item :item="getSlot('lrhand')"></pack-item></div>
				<div class="user-form__slot"><img :src="getSlot('chest').image" /></div>
				<div class="__slot"><img :src="getSlot('ear').image" /></div>
				<div class="__slot"><img :src="getSlot('neck').image" /></div>
				<div class="row">
					<div class="col-md-4 __slot"><img :src="getSlot('finger').image" /></div>
					<div class="col-md-4 __slot"><img :src="getSlot('finger').image" /></div>
					<div class="col-md-4 __slot"><img :src="getSlot('finger').image" /></div>
				</div>
			</div>
			<div class="user-form__image"><img :src="'/img/images/0.png'"></div>
			<div class="user-form__right">
				<div class="user-form__slot"><img :src="getSlot('gloves').image" /></div>
				<div class="user-form__slot"><img :src="getSlot('lhand').image" /></div>
				<div class="user-form__slot"><img :src="getSlot('legs').image" /></div>
				<div class="user-form__slot"><img :src="getSlot('feet').image" /></div>
			</div>
		</div>
	</div>
</template>

<script>
import PackItem from '../items/PackItem';

export default {
	components: { PackItem },

	props: {
		userImage: String,
		items: Array
	},

	computed: {
		
	},

	mounted() {
		// cl(this.items);
	},

	watch: {
		items(items) {
			cl(items);
		}
	},

	methods: {
		getSlot(bodyPart) {
			const item = this.items.filter(item => item.body_part === bodyPart);
			return item[0] ? item[0] : { image: `/img/slots/${bodyPart}.png` };
		}
	}
}
</script>

<style lang="scss">
.user-form {

.row {
	line-height: 0;
}

> .row {
	width: 220px;
	margin-left: 20px;
}

&__left, &__right, &__slot  {
	width: 60px;
}

&__image {
	width: 100px;
}

&__slot {
	height: 60px;
	border: 1px solid #d5d5d5;
	// border-top: transparent;
	// border-right: transparent;
}

}
</style>