<template>
	<div
		class="user-info col-md-4"
		:class="classes"
	>
		<table>
			<tr v-for="i in info" :key="i">
				<td>{{ i.k }}</td>
				<td>{{ i.v }}</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default {
	props: {
		info: {
			type: Array,
			required: false,
			default: () => []
		},

		classes: {
			type: String,
			required: false,
			default: () => ""
		}
	}
}
</script>