<template>
    <div
        id="app"
        class="app"
    >
        <img
            alt="Vue logo"
            src="./assets/logo.png"
        >
        <hello-world msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld,
    },
}
</script>

<style lang="scss">
.app {
    margin-top: 60px;
    color: #000000;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
