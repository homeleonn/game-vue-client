<template>
	<div class="user-form col-md-5">
		<div class="user-form__left">
			<div class="user-form__slot"><img :src="helmet" /></div>
			<div class="user-form__slot"></div>
			<div class="user-form__slot"><img :src="armor" /></div>
			<div class="user-form__slot"></div>
		</div>
		<div class="image">{{ userImage }}</div>
		<div class="user-form__right">
			<div class="user-form__slot"></div>
			<div class="user-form__slot"></div>
			<div class="user-form__slot"></div>
			<div class="user-form__slot"></div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		userImage: String,
		items: Array
	},

	computed: {
		helmet() {
			const item = this.items.filter(item => item.body_part === 'head');
			// cl(item);
			return item[0] ? item[0].image : '/image/slots/helmet.png';
		},

		armor() {
			const item = this.items.filter(item => item.body_part === 'chest');
			return item[0] ? item[0].image : '/img/slots/armor.png';
		},
	},

	mounted() {
		// cl(this.items);
	},

	watch: {
		items(items) {
			cl(items);
		}
	}
}
</script>

<style lang="scss">
.user-form {

&__slot {
	width: 60px;
	height: 60px;
}

}
</style>