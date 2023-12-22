<template>
	<div id="loc-users">
		<div v-for="user in users" :key="user" class="user" :id="`user-${user.id}`">
			<div>
				<img src="/img/chat/prv_but.png" class="prv-msg" title="Отправить приватное сообщение">
			</div>
			<div class="tendency" v-if="user.tendency_name">
				<img :src="`/img/tendencies/${user.tendency_img}`" :title="user.tendency_name" />
			</div>
			<div class="clan" v-if="user.clan_name">
				<img :src="`/img/clans/${user.clan_img}`" :title="user.clan_name" />
			</div>
			<div class="login-wrapper">
				<span class="login">{{ user.login }}</span>
				<span class="level">[{{ user.level }}]</span>
			</div>
			<div>
				<a :href="`${$store.state.host}/user/${user.id}/info`" target="_blank">
					<img src="/img/user/get_info.gif" class="get-info" title="Информация о персонаже">
				</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		users: Array
	},

	mounted() {
		// console.log(this.users);
	}
}
</script>
