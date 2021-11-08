<template>
	<div class="quest-list">
		<h2 class="center">Квесты</h2>
		<div class="__type">
			<div class="active"></div>
			<div class="completed"></div>
			<div class="all"></div>
		</div>
		<simple-tabs :tabs="types" @change="setType"></simple-tabs>
		<div class="__list">
			<div class="__item" v-for="(quest, idx) in quests[activeType]" :key="idx">
				<quest-item :quest="quest"></quest-item>
			</div>
		</div>
	</div>
</template>

<script>
import SimpleTabs from "@/js/components/tools/tabs/SimpleTabs";
import QuestItem from './QuestItem';

export default {
	components: { SimpleTabs, QuestItem },
	inject: ['api', 'apiSubscribe'],
	data() {
		return {
			quests: {},
			types: {
				active: 'Активные',
				completed: 'Завершенные',
				all: 'Все',
			},
			activeType: 'active'
		}
	},

	mounted() {
		this.api.doAction('getQuests', '', quests => {
			const active 		= quests.filter(q => q.completed == 0);
			const completed = quests.filter(q => q.completed == 1);
			const all 			= active.concat(completed);
			this.quests 		= { active, completed, all };
		});
	},

	methods: {
		setType(idx) {
			this.activeType = idx;
		}
	}
}
</script>


<style lang="scss">
.quest-list {
	.__list {
		padding: 10px 0;
		position: relative;
		top: -1px;
		border: 1px #ccc solid;
	}
}
</style>
