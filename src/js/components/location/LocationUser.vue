<template>
	<div v-for="user in users" class="user" id="user-${user.id}">
		<div>
			<img src="img/chat/prv_but.png" class="prv-msg" title="Отправить приватное сообщение">
		</div>
		<div>
			<img src="img/clans/grandparents.png" class="clan" title="Прародители">
		</div>
		<div class="login-wrapper">
			<span class="login">${user.login}</span>
			<span class="level">[0]</span>
		</div>
		<div>
			<img src="img/user/get_info.gif" class="get-info" title="Информация о персонаже">
		</div>
	</div>
</template>

<script>
export default {
	props: {
		user: Array
	}
}
</script>