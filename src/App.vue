<template>
    <div
        id="app"
        class="app"
    >
        <app-select
            v-for="(select, i) in selects"
            :key="i"
            class="app-select"
            :opened.sync="select.opened"
            :items.sync="select.items"
        />
    </div>
</template>

<script>
import AppSelect from '@/components/Select/AppSelect'

export default {
    name: 'App',
    components: {
        AppSelect,
    },
    data() {
        return {
            selects: this.createSelects(parseInt('4', 10)),
        }
    },
    methods: {
        createItems(length) {
            const array = new Array(length).fill('')

            array.forEach((_, i) => {
                array[i] = {
                    text: `Item ${i + 1}`,
                    initialText: `Item ${i + 1}`,
                    value: i + 1,
                    editable: false,
                    focused: false,
                }
            })

            return array
        },
        createSelects(length) {
            const array = new Array(length).fill('')

            array.forEach((_, i) => {
                array[i] = {
                    opened: false,
                    items: this.createItems(Math
                        .ceil(Math.random() * length + 1)),
                }
            })

            return array
        },
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

    .app-select {
        width: 24rem;
        max-width: 100%;

        &:first-of-type {
            margin-top: 10rem;
        }
    }
}
</style>
