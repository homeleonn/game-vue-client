<template>
	<div v-if="modal" class="main-modal">
		<div class="modal">
			<div class="title" v-if="modal.title">{{ modal.title }}</div>
			<div class="message" v-if="modal.message">{{ modal.message }}</div>
			<button class="close" @click="close">Закрыть</button>
	</div>
	</div>
</template>

<script>
export default {
	data() {
		return {

		}
	},

	computed: {
		modal() {
			const modal = this.$store.state.modal;
			if (typeof modal == 'string') return { message: modal };

			return modal;
		}
	},

	mounted() {
		// this.$store.commit('SET_MODAL', {
		// 	message : 'message'
		// });
	},

	methods: {
		close() {
			this.$store.commit('SET_MODAL', null);
		}
	}
}

</script>

<style lang="scss">
.main-modal {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 99999;
	left: 0;
	top: 0;
	background: rgba(0, 0, 0, .6);
	text-align: center;
	padding: 10px;

	> .modal {
		background: #fff;
		display: inline-block;
		min-width: 200px;
		// min-height: 150px;
		border: 5px lightgreen outset;
		border-radius: 10px;

		> div {
			padding: 20px;
		}
	}

	.title {
		border-bottom: 1px solid #ddd;
	}

	.message {

	}

	.close {
		margin: 20px;
	}
}
</style>
