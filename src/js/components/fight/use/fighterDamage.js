export function extra(user) {
	user.curhp = user.maxhp = 400;
	user.critical = 5;
	user.evasion = 200;
	user.super_hits = {
		1: {
			hit: [1, 2],
			step: 0
		},
		2: {
			hit: [1, 3, 2],
			step: 0
		},
	};
}



export function checkSuperHit(type) {
	function checkStep(h, type) {
		return h.hit[h.step] === type;
	}

	for (const level in this.super_hits) {
		const h = this.super_hits[level];

		if (checkStep(h, type)) {
			h.step++;
			if (h.step === h.hit.length) {
				console.log('SUPER-HIT')
				h.step = 0;
				return +level;
			}
		} else {
			h.step = 0;
			if (checkStep(h, type)) {
				h.step++;
			}
		}
	}

	return false;
}