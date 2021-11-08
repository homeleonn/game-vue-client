import { host, port, tokenUrl } from "@/../.env.js";

const DUPLICATE = "1";

export class Server {
	constructor(to, token, tryConnection = 3) {
		this.to = to;
		this.token = token;
		this.tryConnection = tryConnection;
		this.isReconnect = false;
	}

	connect() {
		if (!this.tryConnection--) return;
		if (this.token.match(/\n/g)) {
			console.log('Invalid token:', this.token);
			return;
		}
		this.server = new WebSocket(`${this.to}${this.token}`);
	}

	async connectViaToken() {
		const res = await fetch(tokenUrl + '?id=' + (new URL(document.URL).searchParams.get('id') ?? 1));
		const token = await res.text();
		if (res === "error") {
			throw new Error("Session error");
		} else {
			this.token = "/" + token;
			// console.log(token)
			this.connect();
		}
	}

	send(sendData) {
		this.server.send(JSON.stringify(sendData));
	}
}

export class WS {
	constructor() {
		this.eventHandlers = {};
		this.wsEventHandlers = {};
		this.wsBind();


		this.validActions = [
			'sendMessage',
			'chloc',
			'getBackPack',
			'removeItem',
			'wearItem',
			'takeoffItem',
			'getLocMonsters',
			'attackMonster',
			'getEnemy',
			'getFight',
			'hit',
			'talkToNpc',
			'showQuest',
			'questAnswer',
			'takeReward',
			'getQuests',
		];

		this.validActions.push('debug', 'admin_user');
	}

	send(sendData) {
		this.server.send(sendData);
	}

	open() {
		if (typeof this.wsEventHandlers.open !== "undefined") {
			this.wsEventHandlers.open.forEach(callback =>
				callback.cb.call(callback.ctx)
			);
		}
	}

	message(response) {
		switch (response.data) {
			case DUPLICATE:
				if (this.isReconnect) {
					this.isReconnect = false;
				} else {
					this.exit();
				}

				return;
		}

		const wsResponce = JSON.parse(response.data);
		const event = Object.keys(wsResponce)[0];

		if (typeof this.eventHandlers[event] === "undefined") return;

		this.eventHandlers[event].forEach(function ({ cb, ctx, once }, idx) {
			cb.call(ctx, wsResponce[event]);

			if (once) {

			}
		});
	}

	wsBind() {
		const WS = window.WebSocket;
		const app = this;

		window.WebSocket = function(a, b) {
			const that = b ? new WS(a, b) : new WS(a);
			["message", "open"].forEach(event =>
				that.addEventListener(event, app[event].bind(app))
			);
			// ['open', 'message', 'error', 'close'].forEach(event => that.addEventListener(event, app[event].bind(app)));
			return that;
		};

		window.WebSocket.prototype = WS.prototype;
	}

	exit(isExit = true) {
		if (isExit) {
			// _('body').html('<h1>обнаружено дублирование окна</h1>');
			console.log("<h1>обнаружено дублирование окна</h1>");
			return true;
		}

		return false;
	}

	// api interface

	init() {
		this.server = new Server(`ws://${host}:${port}`);
		this.server.connectViaToken();
	}

	doAction(action, params = '', subscriber = null) {
		if (!this.validActions.includes(action)) {
			throw new Error('Invalid action');
		}

		if (subscriber) {
			this.subscribe(action, subscriber, null, true);
		}

		this.send({ [action]: params });
	}

	// subscribe to events
	subscribe(event, cb, ctx, once = false) {
		if (typeof this.eventHandlers[event] === "undefined") {
			this.eventHandlers[event] = [];
		}
		this.eventHandlers[event].push({ cb, ctx, once });
	}

	unsubscribe(event) {
		delete this.eventHandlers[event];
	}

	// subscribe to browser ws events
	subscribeToWS(event, cb, ctx) {
		if (typeof this.wsEventHandlers[event] === "undefined") {
			this.wsEventHandlers[event] = [];
		}
		this.wsEventHandlers[event].push({ cb, ctx });
	}
}
