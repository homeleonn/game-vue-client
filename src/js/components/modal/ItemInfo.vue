<template>
	{{item}}
	<div class="item-info" v-if="item">
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
				<div class="col-md-3">
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

export default {
	props: ['item'],

	data() {
		return {
			itemProps: {},
			activeItem: false,
			
			autoList: ['power', 'critical', 'evasion', 'stamina', 'hp', 'mf_crit', 'mf_acrit', 'mf_evas', 'mf_aevas', 'weight', 'item_type', 'material']
		}
	},

	methods: {
		itemPropsView(item) {
			if (!item) return;
			if (this.itemProps[item.item_id]) return;
			this.itemProps[item.item_id] = [];
			
			this.autoList.forEach(key => {
				const checkKey = +item[key];
				// cl(key, checkKey);
				if (checkKey !== 0) {
					const value = isNaN(checkKey) ? item[key] : '+' + item[key];
					this.addItemProp(item.item_id, key, value);
				}	
			});
			// cl(this.itemProps[item.item_id]);

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
	},

	watch: {
		item(item) {
			this.itemPropsView(item)
		}
	}


}
</script>

<style lang="scss">
.item-info {
	position: absolute;
	top: 0;
	right: 0;
	background: rgba(0, 0, 0, .8);
	color: white;
	z-index: 999;
	min-width: 300px;

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