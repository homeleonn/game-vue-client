<template>
	<div class="npc-view">
		<div class="row">
			<div class="col-md-3 npc-info">
				<h2 class="center npc-info-name">{{ npc.name }}</h2>
				<div class="center npc-info-img">
					<img :src="`/img/npc/${npc.image}`">
				</div>
				<div class="npc-info-text">
					{{ text }}
				</div>
			</div>
			<div class="col-md-9 quests">
				<h2 class="center">Квесты</h2>
				<hr>
				<div class="active-quest" v-if="activeQuest">
					<h3 class="center">{{ activeQuest.name }}</h3>
					<div class="quest-text">{{ activeQuest.data.text }}</div>
					<div class="quest-reward" v-if="activeQuest.data.reward">
						<div v-for="reward in activeQuest.data.reward" :key="reward">
							<pack-item :item="reward"></pack-item>
						</div>
						<div class="quest-answers">
							<ul><li><span @click="takeReward">Забрать награду</span></li></ul>
						</div>
					</div>
					<div class="quest-answers" v-if="activeQuest.data.answers">
						<ul>
							<li v-for="(answer, idx) in activeQuest.data.answers" :key="idx">
								<span @click="doAnswer(idx)">{{ answer }}</span>
							</li>
						</ul>
					</div>
					<div class="quest-answers" v-else>
						<ul><li><span @click="exit">Закрыть</span></li></ul>
					</div>
				</div>
				<div v-else-if="quests">
					<div v-for="quest in quests" :key="quest.id">
						<div class="quest" @click="showQuest(quest.id)">
							<div class="name">{{ quest.name }}</div>
						</div>
					</div>
				</div>
				<div v-else>На данный момент квестов нет</div>
			</div>
		</div>
	</div>
</template>

<script>
import PackItem from '../user/backpack/items/PackItem'

export default {
	components: { PackItem },
	props: {
		npc: Object
	},

	inject: ['api', 'apiSubscribe'],

	data() {
		return {
			quests: [],
			activeQuest: null
		}
	},

	created() {
		this.apiSubscribe({
			quests: quests => { this.quests = quests },
		});
	},

	methods: {
		showQuest(questId) {
			this.api.doAction('showQuest', { npcId: this.npc.id, questId }, activeQuest => {
				this.activeQuest = activeQuest;
			});
		},

		doAnswer(answerId) {
			this.api.doAction('questAnswer', { npcId: this.activeQuest.npc_id, questId: this.activeQuest.id, answerId }, activeQuest => {
				this.activeQuest = activeQuest;
			});
		},

		exit() {
			this.activeQuest = null;
		},

		takeReward() {
			this.api.doAction('takeReward', { npcId: this.activeQuest.npc_id, questId: this.activeQuest.id }, activeQuest => {
				this.activeQuest = null;
			});
		}
	},

	computed: {
		text() {
			if (this.npc.id == 5) {
				return 'Статуя древнего воина, в этом городе, была возведена еще несколько тысяч лет назад. Неиссякаемая магия всесильных богов вселила в сию статую душу древнего воина и с тех пор он чувствует всё вокруг и может взаимодействовать с миром.';
			}

			return null;
		}
	}
}
</script>

<style lang="scss">
	.npc-view {
		padding: 10px;
		font-size: 1.1em;

		.quests,
		.npc-info,
		.quest,
		.quest-text {
			border: 5px #bcf5bc solid;
			border-radius: 10px;
			padding: 10px;
		}



		.npc-info {
			.npc-info-img {
				margin: 10px 0;
			}
		}

		.quest-text {
			border: 2px #bcf5bc solid;
		}

		.quest-answers {
			span {
				display: block;
				padding: 5px 10px;
				cursor: pointer;
				border: 1px coral solid;
				font-weight: bold;

				&:hover {
					font-weight: bold;
					background: #ddd;
				}
			}
		}

		.quest-answers,
		.quests .quest {
			margin: 10px 5px;
		}

		.quest-reward {
			margin: 10px 0;
		}

		.quests {
			.quest {
				border: 2px #bcf5bc solid;
				border-radius: 5px;
				padding: 4px 10px;
				cursor: pointer;

				&:hover {
					background: coral;
				}
			}
		}
	}
</style>
