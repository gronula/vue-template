<template>
    <div
        id="app"
        class="app"
    >
        <app-select />
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
    max-width: 960px;
    margin-top: 10rem;
}
</style>
