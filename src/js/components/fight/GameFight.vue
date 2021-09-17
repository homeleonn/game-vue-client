<template>
	<div class="fight row" v-if="enemy">
		<div class="col-md-6">
			<user-form :items="[]" :user="$store.getters.user" :info="[]"></user-form>
		</div>
		<div class="col-md-6">
			<user-form :items="[]" :user="enemy" :info="[]"></user-form>
		</div>
	</div>
</template>

<script>
import UserForm from '../user/backpack/form/UserForm'

export default {
	data() {
		return {
			enemy: null
		}
	},


	inject: [
		'api',
		'apiSubscribe'
	],

	created() {
		this.apiSubscribe([
			'_enemy'
		], this);
	},

	mounted() {
		this.api.doAction('getEnemy', 1);
	},

	methods: {
		_enemy(enemy) {
			this.enemy = enemy;
		},
	},

	components: { UserForm }
}
</script>

<style lang="scss">
.fight {
	.user-form-wrapper {
		margin: 0 auto;
	}
	justify-content: space-between;
}
</style>