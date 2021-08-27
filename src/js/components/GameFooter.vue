<template>
  <footer>
    <div class="resizer">
      <div class="up">▲</div>
      <div class="down">▼</div>
    </div>
    <div id="chat">
      <div class="flex">
        <div id="messages" ref="messages"></div>
        <div id="chat-loc">
          <div id="location-caption">
            <span class="name">{{ location.name }}</span>
            (<span class="count">{{ locationUsers.length }}</span>)
            <!-- <span class="update icon-spin3" title="Обновить"></span> -->
          </div>
          <user-list :users="locationUsers"></user-list>
        </div>
      </div>
      <div id="bottom-panel">
        <div id="time"></div>
        <form id="sendmessage-form" class="flex" @submit.prevent>
          <div id="message-wrap"><input class="message" v-model="message" id="message" type="text" name="message" size="80" autocomplete="off"></div>
          <div><input type="image" src="img/chat/message_send.png" title="Отправить" id="sendmessage" @click="send"></div>
        </form>
        <div><img src="img/chat/chat_clear.gif" title="очистить чат" id="chat-clear"></div>
        <div><img src="img/chat/chat.ico" title="Смайлы"></div>
        <form action="/logout" method="post" id="logout">
          <input type="hidden" name="_token" :value="csrf">
          <button name="logout">Выход</button>
        </form>
      </div>
    </div>
  </footer>
</template>

<script>

import { mapGetters } from 'vuex';
import UserList from './location/UserList';

export default {
  name: "GameFooter",

  data() {
    return {
      message: ''
    }
  },

  computed: mapGetters([
    'csrf',
    'location',
    'locationUsers'
  ]),

  methods: {
    send() {
      this.$emit('sendMessage', this.message);
      this.message = '';
      // this.$server.sendMessage(this.message);
      // chat.sendMessage(this.message);
    }
  },

  created() {

  },

  components: { UserList }
}
</script>

<style scoped>

</style>
