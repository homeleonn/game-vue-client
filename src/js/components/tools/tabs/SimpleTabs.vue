<template>
	<div class="tabs">
		<button
			v-for="(tab, key) in tabs"
			:key="tab"
			:class="['tab-button', { active: activeTab === key }]"
			@click="change(key)"
		>
			{{ tab }} {{ countTabItems(key) }}
		</button>
	</div>
</template>

<script>
export default {
	props: {
		tabs: Object,
		counts: {
			type: Object,
			default: null
		}
	},
	emits: {
		activeTab: String,
	},

	data() {
		return {
			activeTab: null,
		}
	},

	methods: {
		change(key) {
			this.activeTab = key;
			this.$emit('change', key);
		},

		countTabItems(tab) {
			return this.counts[tab] ? ` (${this.counts[tab]})` : ' (0)';
		}
	},

	mounted() {
		this.activeTab = Object.keys(this.tabs)[0];
	}
}
</script>


<style lang="scss">
.tabs {
	display: flex;
	// justify-content: space-between;
	position: relative;
	top: 1px;
	padding: 0 5px 0;

	> .tab-button {
		// width: 25%;
		margin: 0 3px 0;
		padding: 4px;
		background: #f4f4f4;
		border: 1px solid #b5b5b5;
		border-bottom: 1px solid #f4f4f4;
		border-radius: 5px 5px 0 0;
		text-align: center;
		cursor: pointer;

		&.active {
			position: relative;
			background: #e3e3e3;
			z-index: 2;
			// font-weight: bold;
		}
	}
}
</style>
