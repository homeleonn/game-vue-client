import { createApp } from 'vue'
import store from './js/store'
import Game from './js/components/Game.vue'
import "./css/main.scss";

const game = createApp(Game);

game
    .use(store)
	.mount('#game');