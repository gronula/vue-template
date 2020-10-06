<template>
    <div
        id="app"
        class="app"
    >
        <app-select class="select" />
    </div>
</template>

<script>
import AppSelect from '@/components/Select/AppSelect'

export default {
    name: 'App',
    components: {
        AppSelect,
    },
}
</script>

<style lang="scss">
.app {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    padding: 1rem;

    .select {
        width: 24rem;
        max-width: 100%;
        margin-top: 10rem;
    }
}
</style>
