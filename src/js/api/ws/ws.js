import { host, port, tokenUrl } from '@/../.env.js';

const DUPLICATE = '1';


export class Server {
  constructor(to, token, tryConnection = 3) {
    this.to = to;
    this.token = token;
    this.tryConnection = tryConnection;
    this.isReconnect = false;
  }

  connect() {
    if (!this.tryConnection--) return;
    this.server = new WebSocket(`${this.to}${this.token}`);
  }

  async connectViaToken() {
    const res = await fetch(tokenUrl);
    const token = await res.text();
    if (res === 'error') {
      throw new Error('Session error');
    } else {
      this.token = '/' + token;
      // cl(token)
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
    this.wsEventHandlers = {}
    this.wsBind();
  }

  send(sendData) {
    this.server.send(sendData);
  }

  open() {
    if (typeof this.wsEventHandlers.open !== "undefined") {
      this.wsEventHandlers.open.forEach(callback => callback.cb.call(callback.ctx));
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

    this.eventHandlers[event].forEach(subscriber => {
      subscriber.cb.call(subscriber.ctx, wsResponce[event]);
    });
  }

  wsBind() {
    const WS = window.WebSocket;
    const app = this;

    window.WebSocket = function(a, b) {
      const that = b ? new WS(a, b) : new WS(a);
      ['message', 'open'].forEach(event => that.addEventListener(event, app[event].bind(app)));
      // ['open', 'message', 'error', 'close'].forEach(event => that.addEventListener(event, app[event].bind(app)));
      return that;
    };

    window.WebSocket.prototype = WS.prototype; 
  }

  exit(isExit = true) {
    if (isExit) {
      // _('body').html('<h1>обнаружено дублирование окна</h1>');
    cl('<h1>обнаружено дублирование окна</h1>');
      return true;
    }

    return false;
  }



  // api interface

  init() {
    this.server = new Server(`ws://${host}:${port}`);
    this.server.connectViaToken()
  }

  chloc(locId) {
    this.send({ chloc: locId });
  }

  sendMessage(message) {
    this.send({ message });
  }

  getBackPack() {
    this.send({ getBackPack: true });
  }


  // subscribe to events
  subscribe(event, cb, ctx) {
    if (typeof this.eventHandlers[event] === "undefined") this.eventHandlers[event] = [];
    this.eventHandlers[event].push({ cb, ctx });
  }

  // subscribe to browser ws events
  subscribeToWS(event, cb, ctx) {
    if (typeof this.wsEventHandlers[event] === "undefined") this.wsEventHandlers[event] = [];
    this.wsEventHandlers[event].push({ cb, ctx });
  }
}