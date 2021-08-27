<template>
	{{item}}
	<div class="item-info" v-if="item">
		<div class="name">{{ item.name }}</div>
		<div class="info">
			<div class="main row">
				<div class="col-md-1">
					<img :src="'/img/items/' + item.image" class="img">
				</div>
				<div class="col-md-8" style="padding-left: 50px;">
					<div class="body-part">Тип: {{ item.body_part }}</div>
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
				<div class="row" v-for="prop in itemProps" :key="prop">
					<div class="name col-md-6">{{ prop.name }}</div>
					<div class="value col-md-6">{{ prop.value }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['item'],

	data() {
		return {
			itemProps: '',
			activeItem: false,
			lang: { name: "\u0438\u043c\u044f", item_type: "\u0422\u0438\u043f", body_part: "\u0427\u0430\u0441\u0442\u044c \u0442\u0435\u043b\u0430", armor_type: "\u0422\u0438\u043f \u0431\u0440\u043e\u043d\u0438", weight: "\u0412\u0435\u0441", material: "\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b", need_level: "\u0423\u0440\u043e\u0432\u0435\u043d\u044c", weapon_type: "\u0422\u0438\u043f \u043e\u0440\u0443\u0436\u0438\u044f", min_damage: "\u041c\u0438\u043d. \u0443\u0440\u043e\u043d", max_damage: "\u041c\u0430\u043a\u0441. \u0443\u0440\u043e\u043d", power: "\u0421\u0438\u043b\u0430", critical: "\u0418\u043d\u0442\u0443\u0438\u0446\u0438\u044f", evasion: "\u041b\u043e\u0432\u043a\u043e\u0441\u0442\u044c", stamina: "\u0412\u044b\u043d\u043e\u0441\u043b\u0438\u0432\u043e\u0441\u0442\u044c", hp: "\u0416\u0438\u0437\u043d\u044c", mf_crit: "\u041c\u0444. \u043a\u0440\u0438\u0442", mf_acrit: "\u041c\u0444. \u0430\u043d\u0442\u0438\u043a\u0440\u0438\u0442", mf_evas: "\u041c\u0444. \u043b\u043e\u0432\u043a", mf_aevas: "\u041c\u0444. \u0430\u043d\u0442\u0438\u043b\u043e\u0432\u043a", def_head: "\u0417\u0430\u0449. \u0433\u043e\u043b\u043e\u0432\u044b", def_chest: "\u0417\u0430\u0449. \u0433\u0440\u0443\u0434\u0438", def_abs: "\u0417\u0430\u0449. \u0436\u0438\u0432\u043e\u0442\u0430", def_crotch: "\u0417\u0430\u0449. \u043f\u043e\u044f\u0441\u0430", price: "\u0426\u0435\u043d\u0430", stackable: "\u0441\u0442\u044b\u043a\u043e\u0432\u043a\u0438", sellable: "\u043f\u0440\u043e\u0434\u0430\u0436\u0438", dropable: "\u0432\u044b\u043f\u0430\u0434\u0435\u043d\u0438\u044f", destroyable: "\u0440\u0430\u0437\u0440\u0443\u0448\u0435\u043d\u0438\u044f", enchantable: "\u0437\u0430\u0442\u043e\u0447\u043a\u0438", enchant_level: "\u0423\u0440. \u0437\u0430\u0442\u043e\u0447\u043a\u0438", max_duration: "\u041c\u0430\u043a\u0441. \u0434\u043e\u043b\u0433\u043e\u0432\u0435\u0447\u043d\u043e\u0441\u0442\u044c", time: "\u0412\u0440\u0435\u043c\u044f \u0436\u0438\u0437\u043d\u0438", time_action: "\u0412\u0440\u0435\u043c\u044f \u0436\u0438\u0437\u043d\u0438 \u0443\u043c\u0435\u043d\u0438\u044f", description: "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435", skill: "\u041d\u0430\u0432\u044b\u043a", image: "\u0418\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435" },
			
			autoList: [
				'power', 'critical', 'evasion', 'stamina', 'hp', 
				'mf_crit', 'mf_acrit', 'mf_evas', 'mf_aevas'
			]
		}
	},

	methods: {
	},

	watch: {
		item(item) {
			this.itemProps = [
				{ name: 'Тип', value: item.item_type },
				{ name: 'Материал', value: item.material },
				// { name: 'Вес', value: item.weight },
				// { name: 'Здоровье', value: '+' + item.hp },
				// { name: 'Цена', value: item.price },
			];

			this.autoList.forEach(key => {
				if (+item[key]) {
					this.itemProps.push({ name: this.lang[key], value: '+' + item[key] });
				}
			});

			if (item.item_type === 'weapon') {
				this.itemProps.push({ 
					name: `Урон`, 
					value: `+${item.min_damage}...+${item.max_damage}` 
				});
			}
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
	// border: 1px solid #000;
	min-width: 300px;

	> * {
		padding: 3px
		// padding: 10px;
	}



	> .name {
		// font-size: 18px;
		// background: #eee;
		text-align: center;
		// color: #000;
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