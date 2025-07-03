<template>
  <main class="content">
    <form id="login" @submit.prevent>
      <h2>Вход</h2>
      <div id="g-recaptcha1" style="display:inline-block; margin: 0 auto;"></div>
      <br><br><a class="btn center entry-button" href="#" @click.prevent="login" v-show="recaptchaLoaded">Войти</a>
        
      <div v-if="!isProd">
        <br><br>id: <input type="text" name="id" id="id" v-model="id"><br><br>
        <div class="inactive" v-if="!isProd">
          <div>Email</div>
          <div><input type="text" name="email"></div>
          <div>Пароль</div>
          <div><input type="password" name="password"></div>
          <div><button>Войти</button></div>
          <div class="row">
            <div class="col-md-6">
              <label for="remember_me">Запомнить меня</label>
              <input type="checkbox" id="remember_me" name="remember_me">
            </div>
            <div class="col-md-6">
              <a href="#">Забыли пароль?</a>
            </div>
          </div>
          <div><a href="#" class="btn">Регистрация</a></div>
        </div>
      </div>
    </form>
    <div class="progressbar-circle2-wrapper">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="10%" stop-color="#ffff00"></stop>
          <stop offset="100%" stop-color="#00ff00"></stop>
        </linearGradient>
      </defs>
      <svg class="progressbar-circle2">
        <circle class="back" cx="120" cy="120" r="110" />
        <circle class="first" cx="120" cy="120" r="110" />
        <circle class="second" cx="120" cy="120" r="110" />
      </svg>
      <div class="serverName"></div>
    </div>
  </main>


  <div class="container screens">
    <h2 class="center title-custom">
      Скриншоты из игры
    </h2>
    <small class="center block white">(На случай, если вдруг сервер "лежит" =)</small>
    <div class="row flex">
      <div class="col-md-4">
        <a class="shower" href="/src/img/fightworld-screens/1.png">
          <img src="@/img/fightworld-screens/resize/1.png">
        </a>
      </div>
      <div class="col-md-4">
        <a class="shower" href="/src/img/fightworld-screens/2.png">
          <img src="@/img/fightworld-screens/resize/2.png">
        </a>
      </div>
      <div class="col-md-4">
        <a class="shower" href="/src/img/fightworld-screens/3.png">
          <img src="@/img/fightworld-screens/resize/3.png">
        </a>
      </div>
      <div class="col-md-4">
        <a class="shower" href="/src/img/fightworld-screens/4.png">
          <img src="@/img/fightworld-screens/resize/4.png">
        </a>
      </div>
      <div class="col-md-4">
        <a class="shower" href="/src/img/fightworld-screens/5.png">
          <img src="@/img/fightworld-screens/resize/5.png">
        </a>
      </div>
      <div class="col-md-4">
        <a class="shower" href="/src/img/fightworld-screens/6.png">
          <img src="@/img/fightworld-screens/resize/6.png">
        </a>
      </div>
      <div class="col-md-4">
        <a class="shower" href="/src/img/fightworld-screens/7.png">
          <img src="@/img/fightworld-screens/resize/7.png">
        </a>
      </div>
    </div>
  </div>

</template>

<script>
import '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
import "@/js/login/js/index.js";
import "@/js/login/js/shower.js";
import { login } from "@/js/api/http/http.js";
import { recaptchaSiteKey, isProd } from "@/../.env.js";

export default {
  name: 'TheLogin',
  emits: [
    'setcc'
  ],

  data: () => ({
    captcha: null,
    id: 1,
    isProd,
    recaptchaLoaded: false
  }),

  mounted() {
    const urls = [
      'https://www.google.com/recaptcha/api.js',
    ];
    urls.forEach(url => {
      let script = document.createElement('script')
      script.setAttribute('src', url);
      document.getElementsByTagName("body")[0].appendChild(script);
    })
    setTimeout(() => {
      grecaptcha.render(document.getElementById('g-recaptcha1'), {
        'sitekey' : recaptchaSiteKey,
        'callback' : (response) => {
          this.captcha = response;
        },
        'theme' : 'dark'
      });
      this.recaptchaLoaded = true;
    }, 2000)
  },

  methods: {
    async login() {
      let response = await login(this.captcha, this.id);

      if (response.ok) {
        let json = await response.json();
        if (json.errors) {
          return alert(JSON.stringify(json.errors));
        }
        window.sessionStorage.setItem('jwt', json.jwt);
        window.location.reload();
        // this.$emit('setcc', 'Game');
      } else {
        alert("Ошибка HTTP: " + response.status);
      }
    }
  }
}
</script>
<style >
@import "@/css/bootstrap-grid.min1.css";
@import "@/css/style.css";
@import "@/css/shower.css";
</style>

<style>
#game {
  height: 80%;
}
</style>