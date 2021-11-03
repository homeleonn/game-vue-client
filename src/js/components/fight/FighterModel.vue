<template>
	<div class="fighter-wrapper" :class="side">
		<div class="fighter"></div>
		<div class="damage"></div>
	</div>
</template>

<script>
import { HIT_TYPES } from './use/Fight';

export default {
	props: ['side', 'damage'],
	watch: {
		damage(newDamage) {
			// console.log(this.side, newDamage);
			blankHit(this.side)(...newDamage);
		}
	}
}

let hit;
// number means how many sprite steps need to do for attack animation
const HIT_STEPS = {
	[HIT_TYPES.HAND]: 3,
	[HIT_TYPES.LEG]: 5,
	[HIT_TYPES.EVASION]: 4,
	[HIT_TYPES.BLOCK]: 4,
	[HIT_TYPES.SUPER]: 5,
};

// const _fighter = [];
// const _damage = [];

function blankHit(side) {
	// console.log(side);
	// let _fighter = [];
	// let _damage = [];
	const stepSize = 177;
	const _fighter = _(`.fighter-wrapper.${side} .fighter`);
	const _damage = _(`.fighter-wrapper.${side} .damage`);
	// console.log(_fighter);
	initStance(_fighter);

	return function (type, damage = 0, crit = false) {
		// console.log(side);

		// if (!type) return;
		// console.log(_fighter);
		let steps = HIT_STEPS[type];
		if (!steps) steps = 0;
		steps--;
		const y = (type - 1) * -200;
		let step = 0;
		let initX = 0;
		if (type === HIT_TYPES.HAND) {
			initX = -stepSize
			steps--;
		}
		let x = initX;
		let color = 'white';


		if (type === HIT_TYPES.EVASION) {
			color = 'lightgreen';
			damage = 'Уворот';
		} else if (type === HIT_TYPES.BLOCK) {
			color = 'black';
			damage = 'Блок';
		} else if (damage !== false) {
			if (crit) {
				color = 'red';
			}

			if (type === HIT_TYPES.SUPER) {
				color = 'gold';
			}

			if (isNumeric(damage)) {
				damage = `-${damage}`;
			}

			_damage.html(`<span style="color: ${color};">${damage}</span>`).addClass('active');
			// setTimeout(() => {
			// 	_damage.removeClass('active');
			// }, 1000);
		}

		if (type !== false && damage !== false) {
			_damage.html(`<span style="color: ${color};">${damage}</span>`).addClass('active');
		}

		setTimeout(() => {
			_damage.removeClass('active');
		}, 1000);


		if (type === false) return;
		setStance(_fighter, x, y);
		const stepAction = (to) => {
			step++;
			x += to ? -stepSize : stepSize;
			setStance(_fighter, x, y);
		}

		let timerId = setInterval(() => {
			if (step >= steps) {
				initStance(_fighter);
				clearInterval(timerId);
				return;
			}
			stepAction(step <= steps);
		}, 200)
	}
}

function initStance(el) {
	// console.log(1)
	setStance(el, 0, -200 * 2)
}

function setStance(el, x, y) {
	el.css('backgroundPosition', `${x}px ${y}px`);
}

</script>


<style lang="scss">
.fighters {
	position: relative;
	// margin-top: 30px;
	// margin-left: 50px;
}

.fighter-wrapper {
	position: relative;
	display: inline-block;

	&.right {
		left: -50px;
	}

	&, .fighter {
		width: 170px;
		height: 197px;
	}

	.fighter {
		top: 0;
		position: absolute;
		border: 0px transparent solid;
		background-image: url('/img/fight/ken.png');
		background-size: 1220px;
	}

	&.right .fighter {
		transform: rotateY(180deg);
	}

	.damage {
		position: absolute;
		font-weight: bold;
		font-size: 30px;
		color: white;
		top: 30%;
		text-align: center;
		margin-top: -10px;
		margin-left: -10px;
		z-index: 999;
		left: 45%;
		display: none;

		&.active {
			display: block;
			animation: flyDamage 1s linear infinite;
		}
	}
}

@keyframes flyDamage {
    from {
        top: 30%;
        opacity: 1;
    }
    to {
        top: -20px;
        opacity: .8;
    }
}
</style>
