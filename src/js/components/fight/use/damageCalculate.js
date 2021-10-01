const min = 5;
export function damageCalculate(u1, u2, stat1, stat2, stat3) {
	let r1 = 0;
	let r2 = 0;
	let cr1, cr2;

	[cr1, cr2] = calcLevel(u1, u2);
	r1 += cr1; r2 += cr2;

	[cr1, cr2] = calcStatBigger(u1, u2, stat1);
	r1 += cr1; r2 += cr2;

	[r1, r2] = [[r1, u1], [r2, u2]].map(r => {
		let result = Math.round(r[0] + calcStat(r[1], stat1, stat2, stat3));
		if (result < min) result = min;

		return result;
	});

	return [r1, r2];
}

function calcLevel(u1, u2) {
	let r1 = 0;
	let r2 = 0;
	const max = 10;
	if (u1.level === u2.level) return [r1, r2];
	if (u1.level > u2.level) {
		r1 += (u1.level - u2.level) * 2;
	} else if (u1.level < u2.level) {
		r2 += (u2.level - u1.level) * 2;
	}

	[r1, r2].forEach(r => { if (r > max) r = max })

	return [r1, r2];
}

function calcStatBigger(u1, u2, stat) {
	let r1 = 0;
	let r2 = 0;
	const max = 15;
	const division = 15;

	if (u1[stat] === u2[stat]) return [r1, r2];

	if (u1[stat] > u2[stat]) {
		r1 += (u1[stat] - u2[stat]) / division;
		if (r1 > max) r1 = max;
		r2 -= r1;
	} else if (u1[stat] < u2[stat]) {
		r2 += (u2[stat] - u1[stat]) / division;
		if (r2 > max) r2 = max;
		r1 -= r2;
	}

	return [r1, r2];
}

function calcStat(u, stat1, stat2, stat3) {
	const max = 30;
	let r = 0;
	let multi = 2;

	if (u[stat1] < u[stat2] || u[stat1] < u[stat3]) {
		multi = 1;
	}

	r = u[stat1] / 5 * multi;
	if (r > max) r = max;

	return r;
}