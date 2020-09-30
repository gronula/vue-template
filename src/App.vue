<template>
    <div id="app">
        <img
            v-if="a"
            alt="Vue logo"
            src="./assets/logo.png"
        >
        <p></p>
        <hello-world
            msg="Welcome to Your Vue.js App"
            @click="() => {}"
        >
            <p>1</p>
        </hello-world>
        <a
            href="//yandex.ru"
            target="_blank"
        ></a>
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld,
    },
    data() {
        return {
            a: 1,
        }
    },
    computed: {
        b() {
            return 1
        },
    },
    watch: {
        a(_, old) {
            console.log(old)
        },
    },
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
