<template>
    <header>
        <div class="avatar" style="background-image:url('img/images/0.png');" title="Персонаж"></div>
        <div class="info-wrapper">
            <div class="info">
                <div class="align"><img src="img/aligns/99.gif"></div>
                <div class="clan"><img src="img/clans/developers.png"></div>
                <div class="login">{{ user.login }}[{{ user.level }}]</div>
            </div>
            <div class="hp-wrapper">
                <div class="hp-back">
                    <div class="hp-line" :style="hpLineStyle"></div>
                </div>
                <div class="hp">{{ user.curhp }} / {{ user.maxhp }}</div>
            </div>
        </div>
        <button class="reset-hp" @click="reset">сбросить хп</button>
        <div class="top-panel flex">
            <div><img src="img/other/pack.jpg" title="Рюкзак" @click="$emit('setCurComp', 'UserBackpack')"></div>
            <div><img src="img/other/location.jpg" title="Локация" @click="$emit('setCurComp', 'LocationWrapper')"></div>
            <div><img src="img/other/fight.jpg" title="Бои"></div>
            <div><img src="img/other/quest.jpg" title="Квесты"></div>
            <div><img src="img/other/info.jpg" title="Анкета"></div>
        </div>
        <div id="dblog">
            <div v-for="query in dbLog" :key="query">
                {{ query.query }}; t::{{ query.time }}; b::{{ query.bindings }};
                <hr>
            </div>
        </div>
    </header>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'

export default {
    name: "GameHeader",

    data() {
        return {
            hpLineStyle: {}
        }
    },

    methods: {
        reset() {
            fetch('/user/reset').then(() => location.reload());
        },

        hpRegeneration(curHp = 200, maxHp = 800, lastRestore) {
            function getTimeSeconds() {
                return (new Date()).getTime() / 1000;
            }

            const hp = (curHp, maxHp, lastRestore) => {
                return () => {
                    const time 	= getTimeSeconds();
                    const limeLeft = time - lastRestore;
                    lastRestore = time;
                    curHp = curHp + limeLeft * restoreOneSecond;
                    // console.log(curHp, limeLeft, lastRestore, maxHp);
                    if (curHp >= maxHp) {
                        curHp = maxHp;
                        endRestoreFlag = true;
                    }
                    this.user.curhp = Math.floor(+curHp);
                    this.user.last_restore = time;
                    this.SET_USER(this.user);


                    const curHpInPercent = curHp / maxHp * 100;
                    const color = curHpInPercent < 33 ? '#993e3e' : (curHpInPercent < 66 ? '#dddd42' : 'green');

                    this.hpLineStyle.width = curHp / maxHp * 100 + '%';
                    this.hpLineStyle.backgroundColor = color;
                    
                    return endRestoreFlag;
                }
            }

            const restoreSpeed = 1;
            const minutesToMaxHp = 5;
            const renderSpeed = 1 / 2;
            let endRestoreFlag	= false;
            const restoreOneSecond = maxHp / (minutesToMaxHp / restoreSpeed) / 60;

            const HpRestore = hp(curHp, maxHp, lastRestore);
            const stop = HpRestore();

            if (!stop) {
                const timer = setInterval(() => {
                    if (HpRestore()) {
                        clearInterval(timer);
                    }
                }, 1000 / renderSpeed);
            }
        },
        ...mapMutations(['SET_USER']),
    },

    computed: {
        ...mapGetters([
            'user',
            'dbLog'
        ]),
    },

    mounted() {
    },

    watch: {
        user(user) {
            console.log('hpRegeneration');
            // if (user.curhp < user.maxhp) {
                this.hpRegeneration(this.user.curhp, this.user.maxhp, this.user.last_restore);
            // }
        }
    }
}
</script>

<style>
    
</style>
