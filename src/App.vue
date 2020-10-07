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
            :search-available="select.searchAvailable"
            :addition-available="select.additionAvailable"
        />

        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestias, dolor nesciunt libero voluptas corporis excepturi. Dolorem accusamus excepturi placeat asperiores, cupiditate at debitis ratione consequatur exercitationem, recusandae perferendis odio rem.
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
            selects: this.createSelects(parseInt('8', 10)),
        }
    },
    mounted() {
        this.setScrollbarWidth()
        window.addEventListener('resize', this.onWindowResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {
        createItems(length) {
            const array = new Array(length).fill('')

            array.forEach((_, i) => {
                array[i] = {
                    text: `item ${i + 1}`,
                    initialText: `item ${i + 1}`,
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
                    searchAvailable: i % 2 === 0,
                    additionAvailable: i % 3 === 0,
                    items: this.createItems(Math
                        .ceil(Math.random() * length + 1)),
                }
            })

            return array
        },
        getScrollbarWidth() {
            const div = document.createElement('div')

            div.style.overflowY = 'scroll'
            div.style.position = 'absolute'
            div.style.width = '50px'
            div.style.height = '50px'
            div.style.visibility = 'hidden'

            document.body.appendChild(div)
            const scrollWidth = div.offsetWidth - div.clientWidth

            document.body.removeChild(div)

            return scrollWidth
        },
        setScrollbarWidth() {
            document.documentElement.style.setProperty(
                '--scrollbar-width',
                `${this.getScrollbarWidth()}px`,
            )
        },
        onWindowResize() {
            this.setScrollbarWidth()
        },
    },
}
</script>

<style lang="scss">
.app {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
    min-height: 100vh;
    padding: 1rem;

    .app-select {
        width: 24rem;
        max-width: 100%;

        &:first-of-type {
            margin-top: 2rem;
        }
    }
}
</style>
