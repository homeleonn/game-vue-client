import { host, port, tokenUrl, env } from "@/../.env.js";

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
		// console.log(1);
		// const res = await fetch(tokenUrl + '?jwt='+sessionStorage.getItem('jwt')+'&id=' + (new URL(document.URL).searchParams.get('id') ?? 1));
		const res = await fetch(tokenUrl + '?jwt='+sessionStorage.getItem('jwt'));
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
    	this.connected = false;
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
			'attackUser',
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
    this.connected = true;
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
		if (response.data === 'ping') return;
		const wsResponce = JSON.parse(response.data);
		const event = Object.keys(wsResponce)[0];

		if (typeof this.eventHandlers[event] === "undefined") return;

		this.eventHandlers[event].forEach(({ cb, ctx, once }, idx) => {
			cb.call(ctx, wsResponce[event]);

			if (once) {
				// this.unsubscribe(event);
			}
		});
	}

  close() {
    if (this.connected) {
      this.eventHandlers = {};
      this.wsEventHandlers = {};
      this.connected = false;
      setTimeout(() => {
        document.location.reload();
        // console.log('connecting ...')
        // this.init();
      }, 1500);
    }
  }

	wsBind() {
		const WS = window.WebSocket;
		const app = this;

		window.WebSocket = function(a, b) {
			const that = b ? new WS(a, b) : new WS(a);
			["message", "open", "close"].forEach(event =>
				that.addEventListener(event, app[event].bind(app))
			);
			// ['open', 'message', 'error', 'close'].forEach(event => that.addEventListener(event, app[event].bind(app)));
			return that;
		};

		window.WebSocket.prototype = WS.prototype;
	}

	exit(isExit = true) {
		if (isExit) {
			const msg = '<h1>обнаружено дублирование окна</h1>';
			if (env == 'prod') {
				_('body').html(msg);
			} else {
				console.log(msg);
			}
			return true;
		}

		return false;
	}

	// api interface

	init() {
		const protocol = port == '443' ? 'wss' : 'ws';
		this.server = new Server(`${protocol}://${host}:${port}`);
		this.server.connectViaToken();
		// console.log(args);
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
		this.eventHandlers[event] = [{ cb, ctx, once }];
		// this.eventHandlers[event].push({ cb, ctx, once });
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
