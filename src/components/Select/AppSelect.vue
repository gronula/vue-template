<template>
    <div :class="['select', { opened: opened }]">
        <button
            class="select__current"
            type="button"
            @click.stop.prevent="toggleSelect"
        >
            <span>{{ currentItem.initialText }}</span>
            <i class="fas fa-chevron-down"></i>
        </button>

        <transition name="fade">
            <div
                v-if="opened"
                class="select__wrapper"
                @click.stop=""
            >
                <app-select-search
                    :search.sync="search"
                    @add="addItem"
                />

                <app-select-list
                    v-if="searchedItems.length"
                    :items="searchedItems"
                    @select="selectItem"
                    @edit="editItem"
                    @input="updateText"
                    @remove="removeItem"
                />

                <p
                    v-else
                    class="select__empty-text"
                >
                    No items
                </p>
            </div>
        </transition>
    </div>
</template>

<script>
import AppSelectSearch from '@/components/Select/AppSelectSearch'
import AppSelectList from '@/components/Select/AppSelectList'

export default {
    name: 'AppSelect',
    components: {
        AppSelectSearch,
        AppSelectList,
    },
    data() {
        return {
            opened: true,
            items: [
                {
                    text: 'One',
                    initialText: 'One',
                    value: 1,
                },
                {
                    text: 'Two',
                    initialText: 'Two',
                    value: 2,
                },
                {
                    text: 'Three',
                    initialText: 'Three',
                    value: 3,
                },
                {
                    text: 'FourFour FourFourFour Four FourFour',
                    initialText: 'FourFour FourFourFour Four FourFour',
                    value: 4,
                },
            ],
            search: '',
        }
    },
    computed: {
        currentItem() {
            return this.items.reduce(
                (acc, cur) => (cur.selected ? cur : acc),
                {
                    disabled: true,
                    initialText: 'Select item...',
                    value: null,
                },
            )
        },
        searchedItems() {
            return [...this.items].filter(item => item.text
                .toLowerCase()
                .includes(this.search.toLowerCase()))
        },
        focusedItemIndex() {
            return this.searchedItems.findIndex(item => item.focused)
        },
    },
    mounted() {
        if (this.opened) {
            document.addEventListener('click', this.documentClickHandler)
            document.addEventListener('keyup', this.documentKeyupHandler)
        }
    },
    methods: {
        toggleSelect() {
            this.opened = !this.opened

            if (this.opened) {
                document.addEventListener('click', this.documentClickHandler)
                document.addEventListener('keyup', this.documentKeyupHandler)
            } else {
                this.closeSelect()
                document.removeEventListener(
                    'click',
                    this.documentClickHandler,
                )
            }
        },
        closeSelect() {
            this.opened = false

            this.items.forEach(item => this.$set(item, 'editable', false))

            document.removeEventListener('keyup', this.documentKeyupHandler)
        },
        selectItem({ item }) {
            if (item.editable) {
                return
            }

            this.currentItem.selected = false
            this.$set(item, 'selected', true)
            this.closeSelect()
            this.search = ''
        },
        documentClickHandler() {
            if (this.opened) {
                this.closeSelect()
            }
            document.removeEventListener('click', this.documentClickHandler)
        },
        documentKeyupHandler(e) {
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
                return
            }

            let focusedIndex = 0

            if (this.focusedItemIndex !== -1) {
                if (e.key === 'ArrowUp') {
                    focusedIndex = this.focusedItemIndex < 1
                        ? this.searchedItems.length - 1
                        : this.focusedItemIndex - 1
                }

                if (e.key === 'ArrowDown') {
                    if (this.focusedItemIndex < this.searchedItems.length - 1) {
                        focusedIndex = this.focusedItemIndex + 1
                    }
                }
            }

            this.setFocus(focusedIndex)
        },
        setFocus(index) {
            this.items.forEach((item, i) => {
                this.$set(item, 'focused', index === i)
            })
        },
        setEditable(value, editable) {
            this.items.forEach(item => {
                this.$set(
                    item,
                    'editable',
                    item.value === value ? editable : false,
                )
            })
        },
        addItem() {
            if (!this.search) {
                return
            }

            this.items.push({
                initialText: this.search,
                text: this.search,
                value: this.items.length + 1,
            })

            this.search = ''
        },
        editItem({ item: { value }, editable }) {
            this.setEditable(value, editable)
        },
        updateText({ item, value, needUpdateInititalText = false }) {
            item.text = value

            if (needUpdateInititalText) {
                item.initialText = value
            }
        },
        removeItem({ item: { value, editable } }) {
            if (editable) {
                const item = this.items.find(el => el.value === value)

                if (!item) {
                    return
                }

                item.text = item.initialText
            } else {
                this.items = this.items.filter(item => item.value !== value)
            }

            this.setEditable(value, false)
        },
    },
}
</script>

<style lang="scss" scoped>
.select {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0.5rem;

    &__current {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background-color: map-get($colors, white);
        border: 1px solid map-get($colors, border-color);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: $trs;

        span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        i {
            margin-left: 2rem;
            transition: $trs;

            .select.opened & {
                transform: rotate(180deg);
            }
        }

        &:hover,
        &:focus,
        .select.opened & {
            border-color: map-get($colors, border-color-hover);
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }
    }

    &__wrapper {
        position: absolute;
        top: calc(100% - 1px);
        right: 0;
        left: 0;
        overflow: hidden;
        background-color: map-get($colors, white);
        border: 1px solid map-get($colors, border-color);
        border-bottom-right-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        pointer-events: none;

        .select.opened & {
            border-color: map-get($colors, border-color-hover);
            box-shadow: $shadow;
            pointer-events: all;
        }
    }

    &__empty-text {
        margin: 0;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        line-height: 1.5;
        text-align: center;
    }
}
</style>
