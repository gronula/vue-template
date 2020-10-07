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
    props: {
        items: {
            type: Array,
            required: true,
        },
        opened: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            search: '',
            controlKeys: [
                'Escape',
                'ArrowUp',
                'ArrowDown',
            ],
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
        async toggleSelect() {
            this.$emit('update:opened', !this.opened)

            await this.$nextTick()

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
        async closeSelect() {
            this.$emit('update:opened', false)

            await this.$nextTick()

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
        documentClickHandler(e) {
            const { target } = e
            const closestSelect = target.closest('.select')

            if (closestSelect === this.$refs.select) {
                return
            }

            if (this.opened) {
                this.closeSelect()
            }

            document.removeEventListener('click', this.documentClickHandler)
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
        addItem() {
            if (!this.search) {
                return
            }

            this.$emit('update:items', [
                ...this.items,
                {
                    initialText: this.search,
                    text: this.search,
                    value: Date.now(),
                },

            ])

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
        async removeItem({ item: { value } }) {
            console.log('remove')

            this.$emit('update:items', [
                ...this.items
                    .filter(item => item.value !== value),
            ])

            await this.$nextTick()

            this.setEditable(value, false)
        },
        async revertItem({ item: { value } }) {
            console.log('revert')

            const item = this.items.find(el => el.value === value)

            if (!item) {
                return
            }

            item.text = item.initialText

            await this.$nextTick()

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
