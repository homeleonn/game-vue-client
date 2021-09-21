import { ref, computed } from 'vue'
import { useStore } from 'vuex'

// const store = useStore();

// const hitVerbs = {
// 	1: 'голову',
// 	2: 'корпус',
// 	3: 'ноги',
// };
// let mdt = null;
// let timer = null;
// const aliveEnemies = [
// 	{}, {}
// ];


export function fight() {
	const a = ref(0);
	const store = useStore();
	// const b = reactive({});
	// b.a = 1;
	const user = computed(() => store.getters.user);
	setTimeout(() => { user.value.curhp = 10 }, 2000);

	return {
		a
	}
}