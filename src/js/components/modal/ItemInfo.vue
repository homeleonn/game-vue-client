<template>
	<!-- {{activeItem}} -->
	<div class="item-info" v-if="activeItem">
		<div class="name">{{ item.name }}</div>
		<div class="info">
			<div class="main row">
				<div class="col-md-1">
					<img :src="item.image" class="img">
				</div>
				<div class="col-md-8" style="padding-left: 50px;">
					<div class="body-part">Тип: {{ langValue(item.body_part) }}</div>
					<div class="body-duration">
						Состояние: {{ item.duration || -1 }}/{{ item.max_duration || -1 }}
					</div>
					<div class="price">Цена: {{ item.price }}</div>
				</div>
				<div class="col-md-3" :class="{red : item.need_level > user.level}">
					Ур.: {{ item.need_level }}
				</div>
			</div>
			<div class="stats">
				<div class="row" v-for="prop in itemProps[item.item_id]" :key="prop">
					<div class="name col-md-6">{{ prop.name }}</div>
					<div class="value col-md-6">{{ prop.value }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { langKey, langValue } from '../../lang/ru';
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			item: null,
			itemProps: {},

			autoList: ['power', 'critical', 'evasion', 'stamina', 'hp', 'weight', 'item_type', 'material']
		}
	},

	computed: {
		...mapGetters(['activeItem', 'user']),
	},

	watch: {
		activeItem(item) {
			this.item = item;
			this.itemPropsView(item)
		}
	},

	methods: {
		itemPropsView(item) {
			if (!item) return;
			if (this.itemProps[item.item_id]) return;
			this.itemProps[item.item_id] = [];

			this.autoList.forEach(key => {
				const checkKey = +item[key];
				if (checkKey !== 0) {
					const value = isNaN(checkKey) ? item[key] : '+' + item[key];
					this.addItemProp(item.item_id, key, value);
				}
			});

			if (item.item_type === 'weapon') {
				this.addItemProp(item.item_id, 'Урон', `+${item.min_damage}...+${item.max_damage}`, true)
			}
		},

		addItemProp(itemId, key, value, rawKey = false) {
			this.itemProps[itemId].push({
				name: (rawKey ? key : langKey[key]),
				value: (langValue[value] ? langValue[value] : value)
			});
		},

		langValue(value) {
			return langValue[value];
		}
	}
}
</script>

<style lang="scss">
.item-info {
	// transform: scale(.5);
	position: fixed;
	top: 0;
	right: 0;
	background: rgba(0, 0, 0, .8);
	color: white;
	z-index: 999;
	min-width: 300px;

	img {
		width: 60px;
		height: 60px;
	}

	> * {
		padding: 3px
	}

	.stats > .row:nth-child(odd) {
		background: rgba(255, 255, 255, .1);
	}


	> .name {
		text-align: center;
		font-weight: bold;
		border-bottom: 1px solid #eee;
	}

	> .info {
		padding: 3px;

		.name {
			padding-right: 50px;
		}

		.value {
			text-align: right;
		}
	}
}

</style>
