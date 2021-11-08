<template>
	<div class="quest-item">
		<div class="__name" @click="active = !active">{{ quest.name }}</div>
		<div class="__detail" v-show="active">
			<div class="__text">{{ quest.data.text }}</div>
			<div class="__condition">{{ quest.data.condition }}</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['quest'],

	data() {
		return {
			active: null
		}
	}
}
</script>

<style lang="scss">
.quest-item {
	margin: 2px 5px;
	border: 1px #ccc solid;
	padding: 4px 10px;

	.__name {
		font-weight: bold;
		cursor: pointer;
		padding: 4px 10px;

		&:hover {
			background: #ccc;
		}
	}

	.__condition {
		margin: 15px 0 0 15px;

		&:before {
			content: ' * ';
		}
	}
}
</style>
