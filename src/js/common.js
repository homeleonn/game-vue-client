export function z(num) {
	return +num > 9 ? num : '0' + num;
}

export function timer(seconds, callback = false) {
	const hours = seconds / 3600;
	seconds = seconds % 3600;
	const minutes = seconds / 60;
	seconds = seconds % 60;

	const time = [hours, minutes, seconds].map((item) => {
		return z(Math.floor(item));
	});


	return time.join(':');
}

export function fnOnTimeout(callback, delay = 1000) {
	var timeout = false;

	return function() {
		if (!timeout) {
			timeout = true;

			setTimeout(() => {
				callback(...arguments);
				timeout = false;
			}, delay);
		}
	}
}

export function cl(){
	console.log(...arguments, ' / ' + new Error().stack.split(/\n/)[1].split('/').pop());
}

export function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, options = {}) {
	options = {
		path: '/',
		...options
	};

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

	for (let optionKey in options) {
		updatedCookie += "; " + optionKey;
		let optionValue = options[optionKey];
		if (optionValue !== true) {
			updatedCookie += "=" + optionValue;
		}
	}

	document.cookie = updatedCookie;
}

export function date(format, date = new Date()) {
	if (format === 'H:i:s') return date.toLocaleTimeString();

	let formats = {
		"H": 'Hours',
		"i": 'Minutes',
		"s": 'Seconds',
		"Y": 'FullYear',
		"y": 'FullYear',
		"m": 'Month',
		"d": 'Day'
	};

	return format.replace(/([YymdHis])/g, item => {
		let s = z(date['get' + formats[item]]());
		return item === 'y' ? s.toString().substr(2, 2) : s;
	});
}


export function add(el, event, callback) {
	if (!isFunction(callback)) {
		throw 'Parameter callback must be callable';
	}

	el.addEventListener(event, callback, false);
}

export function isFunction(guess, exception = false) {
	const flag = typeof guess === 'function';

	if (exception && !flag) {
		throw `${guess} don't callable`;
	}

	return flag;
}


function sortClosestLocationsByType(closestLocations) {
    const closestLocationByType = {};
    for (const closestLocation of closestLocations) {
        if (typeof closestLocationByType[closestLocation.type] == 'undefined') {
            closestLocationByType[closestLocation.type] = [];
        }
        closestLocationByType[closestLocation.type].push(closestLocation);
    }

    return closestLocationByType;
}
