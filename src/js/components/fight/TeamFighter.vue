<template>
	{{fighter.id}}:{{fighter.login}}[{{fighter.level}}]({{fighter.curhp}}/{{fighter.maxhp}})
	
</template>

<script>
export default {
	props: ['fighter'],

	computed: {
		f() {
			return `${this.fighter.id}:${this.fighter.login}[${this.fighter.level}](${this.fighter.curhp}/${this.fighter.maxhp})`;
		}
	}
}
</script>