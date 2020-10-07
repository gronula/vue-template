<template>
    <div
        ref="select"
        :class="['select', { opened: opened }]"
    >
        <button
            class="select__current"
            type="button"
            @click.prevent="toggleSelect"
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
                    v-if="searchAvailable"
                    :search="search"
                    @add="addItem"
                    @input="updateSearch"
                />

                <app-select-list
                    v-if="searchedItems.length"
                    :items="searchedItems"
                    @focus="focusItem"
                    @blur="blurItem"
                    @select="selectItem"
                    @edit="editItem"
                    @input="updateText"
                    @remove="removeItem"
                    @revert="revertItem"
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
    provide() {
        return {
            additionAvailable: this.additionAvailable,
        }
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
        opened: {
            type: Boolean,
            default: false,
        },
        searchAvailable: {
            type: Boolean,
            default: false,
        },
        additionAvailable: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            search: {
                query: '',
                addBtnDisabled: false,
            },
            controlKeys: [
                'Escape',
                'ArrowUp',
                'ArrowDown',
            ],
        }
    },
    computed: {
        currentItem() {
            return this.items.reduce((acc, cur) => (cur.selected ? cur : acc), {
                disabled: true,
                initialText: 'Select item...',
                value: null,
            })
        },
        searchedItems() {
            return [...this.items].filter(item => item.text
                .toLowerCase()
                .includes(this.search.query.toLowerCase()))
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
    beforeDestroy() {
        document.addEventListener('click', this.documentClickHandler)
        document.addEventListener('keyup', this.documentKeyupHandler)
    },
    methods: {
        toggleSelect() {
            if (this.opened) {
                this.closeSelect()
            } else {
                this.openSelect()
            }
        },
        openSelect() {
            this.$emit('update:opened', true)

            document.addEventListener('click', this.documentClickHandler)
            document.addEventListener('keyup', this.documentKeyupHandler)
        },
        closeSelect() {
            this.$emit('update:opened', false)

            document.removeEventListener('click', this.documentClickHandler)
            document.removeEventListener('keyup', this.documentKeyupHandler)
        },
        documentClickHandler(e) {
            const { target } = e
            const closestSelect = target.closest('.select')

            if (closestSelect === this.$refs.select) {
                return
            }

            if (this.opened) {
                this.closeSelect()
            }
        },
        documentKeyupHandler(e) {
            if (!this.controlKeys.includes(e.key)) {
                return
            }

            if (e.key === 'Escape') {
                this.closeSelect()

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
            this.searchedItems.forEach((item, i) => {
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
        focusItem({ item: { value } }) {
            const index = this.searchedItems
                .findIndex(item => item.value === value)

            if (index > -1) {
                this.setFocus(index)
            }
        },
        blurItem({ item }) {
            item.focused = false
        },
        selectItem({ item }) {
            if (item.editable) {
                return
            }

            this.currentItem.selected = false
            this.$set(item, 'selected', true)
            this.closeSelect()
            this.search.query = ''
        },
        updateSearch(query) {
            this.search.query = query

            const sameItem = this.items
                .find(item => item.text === this.search.query)

            this.search.addBtnDisabled = !!sameItem
        },
        addItem() {
            if (!this.search.query) {
                return
            }

            this.$emit('update:items', [
                ...this.items,
                {
                    initialText: this.search.query,
                    text: this.search.query,
                    value: Date.now(),
                },
            ])

            this.search.query = ''
        },
        editItem({ item: { value }, editable }) {
            const editedItem = this.items.find(item => item.editable)

            if (editedItem && editedItem.value !== value) {
                this.revertItem({ item: editedItem })
            }

            this.setEditable(value, editable)
        },
        updateText({ item, value, needUpdateInititalText = false }) {
            item.text = value

            if (needUpdateInititalText) {
                item.initialText = value
            }
        },
        removeItem({ item: { value } }) {
            this.$emit(
                'update:items',
                [...this.items.filter(item => item.value !== value)],
            )
        },
        revertItem({ item }) {
            item.text = item.initialText
            item.editable = false
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

        &:focus,
        .select.opened & {
            z-index: 3;
        }
    }

    &__wrapper {
        position: absolute;
        top: calc(100% - 1px);
        right: 0;
        left: 0;
        z-index: 0;
        overflow: hidden;
        background-color: map-get($colors, white);
        border: 1px solid map-get($colors, border-color);
        border-bottom-right-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        transition: $trs;
        pointer-events: none;

        .select.opened & {
            z-index: 2;
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
