import { createApp } from 'vue'
import store from './js/store/store'
import Game from './js/components/TheIndex.vue'

const game = createApp(Game);

game
	.use(store)
	.mount('#game');
