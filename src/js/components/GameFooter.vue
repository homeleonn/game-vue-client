<template>
	<footer ref="footer">
		<div class="resizer">
			<div class="up" @click="resize(true)">▲</div>
			<div class="down" @click="resize(false)">▼</div>
		</div>
		<div id="chat">
			<div class="flex">
				<div id="messages" ref="messages"></div>
				<div class="fight-log" v-show="isFightLogVisible">
					<div v-for="(log, idx) in $store.state.fightLog" :key="log" v-html="idx + '. ' + log"></div>
				</div>
				<button class="fight-log-toggle btn" :class="{active: isFightLogVisible}" @click="isFightLogVisible = !isFightLogVisible">Лог боя</button>
				<div id="chat-loc">
					<div id="location-caption">
						<span class="name">{{ location.name }}</span>
						(<span class="count">{{ locationUsers.length }}</span
						>)
						<!-- <span class="update icon-spin3" title="Обновить"></span> -->
					</div>
					<user-list :users="locationUsers"></user-list>
				</div>
			</div>
			<div id="bottom-panel">
				<div id="time"></div>
				<form id="sendmessage-form" class="flex" @submit.prevent>
					<div id="message-wrap">
						<input
							class="message"
							v-model="message"
							id="message"
							type="text"
							name="message"
							size="80"
							autocomplete="off"
						/>
					</div>
					<div>
						<input
							type="image"
							src="img/chat/message_send.png"
							title="Отправить"
							id="sendmessage"
							@click="send"
						/>
					</div>
				</form>
				<div>
					<img
						src="img/chat/chat_clear.gif"
						title="очистить чат"
						id="chat-clear"
					/>
				</div>
				<div><img src="img/chat/chat.ico" title="Смайлы" /></div>
				<div><button @click="doAction">doAction</button></div>
				<div><button @click="$emit('setCurComp', 'TheDebug')">Debug</button></div>
				<form action="/logout" method="post" id="logout">
					<input type="hidden" name="_token" :value="csrf" />
					<button name="logout">Выход</button>
				</form>
			</div>
		</div>
	</footer>
</template>

<script>
import { mapGetters } from "vuex";
import UserList from "./location/UserList";
let _footer;

export default {
	name: "GameFooter",

	emits: ['setCurComp'],
	
	inject: [
		'api',
	],

	data() {
		return {
			message: "",
			isFightLogVisible: false,
		};
	},

	computed: {
		...mapGetters(["csrf", "location", "locationUsers"]),
	},

	methods: {
		send() {
			this.$emit("sendMessage", this.message);
			this.message = "";
		},
		doAction() {
			this.api.doAction('admin_user', {
				userId: 1,
				props: {
					curhp: 18
				}
			})
		},

		resize(isUp) {
			const stepSize = 50;
			let footerHeight = _footer.css('height', false);

			footerHeight += isUp ? stepSize : -stepSize; 
			_footer.css('height', footerHeight + 'px');
		}
	},

	created() {},
	mounted() {
		_footer = _('footer');
		let _fightLog = document.querySelector('.fight-log');

		this.$store.watch((state) => state.fightLog, () => {
			// let _fightLog = document.querySelector('.fight-log');
			setTimeout(() => { _fightLog.scroll(0, _fightLog.scrollHeight + 100); }, 0);
		}, { deep: true })
	},

	components: { UserList }
}
</script>

<style lang="scss">
.fight-log {
	// width: 500px;
	flex-basis: 400px;
	border-right: 1px lightgreen solid;
	// overflow: hidden;
	overflow-y: scroll;
	font-size: 10px;

	> div {
		padding: 1px 0 3px 10px;
		font-weight: bold;

		&:nth-child(odd) {
			background: #f1f1f1;
		}
	}
}

.fight-log-toggle {
	position: absolute;
	right: 305px;
	padding: 1px;

	&.btn {
		padding: 3px;
	}

	&.active {
		right: 705px;
		border-style: inset;
	}
}
</style>
