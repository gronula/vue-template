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
                <div class="select__search">
                    <label class="select__label">
                        <i class="fas fa-search"></i>
                        <input
                            v-model.trim="search"
                            class="select__input"
                            type="text"
                            placeholder="Search..."
                        >
                    </label>
                    <button
                        :disabled="!search"
                        class="select__add-btn"
                        type="button"
                        @click="addItem"
                    >
                        <i class="fas fa-plus-circle"></i>
                    </button>
                </div>
                <ul
                    v-if="searchedItems.length"
                    class="select__list"
                >
                    <li
                        v-for="(item, i) in searchedItems"
                        :key="i"
                        :class="[
                            'select__item',
                            { selected: item.selected },
                            { focused: item.focused },
                        ]"
                    >
                        <input
                            v-model.trim="item.text"
                            ref="selectText"
                            :disabled="item.disabled"
                            :type="item.focused ? 'text' : 'button'"
                            class="select__item-text"
                            @click.stop.prevent="selectItem(item)"
                        >
                        <button
                            :disabled="!item.text"
                            class="select__item-btn select__item-btn--edit"
                            type="button"
                            @click="editItem($event, item)"
                        >
                            <i
                                :class="[
                                    'fas fa-xs',
                                    item.focused ? 'fa-check' : 'fa-pen',
                                ]"
                            ></i>
                        </button>
                        <button
                            class="select__item-btn select__item-btn--remove"
                            type="button"
                            @click="removeItem(item)"
                        >
                            <i
                                :class="[
                                    'fa-xs',
                                    item.focused
                                        ? 'fas fa-undo'
                                        : 'far fa-times-circle',
                                ]"
                            ></i>
                        </button>
                    </li>
                </ul>
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
export default {
    name: 'AppSelect',
    data() {
        return {
            opened: false,
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
            return this.items.reduce((acc, cur) => (cur.selected ? cur : acc), {
                disabled: true,
                initialText: 'Select item...',
                value: null,
            })
        },
        searchedItems() {
            return [...this.items].filter(item => item.text
                .toLowerCase()
                .includes(this.search.toLowerCase()))
        },
    },
    mounted() {
        if (this.opened) {
            document.addEventListener('click', this.documentClickHandler)
        }
    },
    methods: {
        toggleSelect() {
            this.opened = !this.opened

            if (this.opened) {
                document.addEventListener('click', this.documentClickHandler)
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

            this.items.forEach(item => this.$set(item, 'focused', false))
        },
        selectItem(item) {
            if (item.focused) {
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
        async editItem(e, { value, focused }) {
            this.items.forEach(item => {
                this.$set(
                    item,
                    'focused',
                    item.value === value ? !item.focused : false,
                )
            })

            await this.$nextTick()

            const itemEl = e.target.closest('.select__item')

            if (!itemEl) {
                return
            }

            const textEl = itemEl.querySelector('.select__item-text')

            if (!textEl) {
                return
            }

            if (!focused) {
                textEl.focus()
            } else {
                const item = this.items.find(el => el.value === value)

                if (!item?.newText) {
                    return
                }

                item.text = item.newText
                item.newText = ''
            }
        },
        removeItem({ value, focused }) {
            if (focused) {
                const item = this.items.find(el => el.value === value)

                if (!item) {
                    return
                }

                item.text = item.initialText
            } else {
                this.items = this.items.filter(item => item.value !== value)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.select {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 14rem;
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

    &__search {
        display: flex;
        width: 100%;
        border-bottom: 1px solid map-get($colors, border-color-hover);
    }

    &__label {
        position: relative;
        display: flex;
        flex-grow: 1;
        align-items: center;

        i {
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
        }
    }

    &__input {
        flex-grow: 1;
        width: 0;
        padding-top: 0.75rem;
        padding-right: 1rem;
        padding-bottom: 0.75rem;
        padding-left: 3rem;
        font-size: 1rem;
        line-height: 1.5;
        border: 0;
    }

    &__add-btn {
        width: 3rem;
        height: 3rem;
        padding: 0;
        background-color: transparent;
        border: 0;
        border-left: 1px solid map-get($colors, border-color-hover);
        cursor: pointer;
        transition: $trs;

        &[disabled] {
            pointer-events: none;
        }

        &:hover,
        &:focus {
            background-color: map-get($colors, bg-hover);
        }
    }

    &__list {
        max-height: calc(3.1rem * 5 + 1px * 2); // show 5 items
        margin-top: 0;
        margin-bottom: 0;
        padding-left: 0;
        overflow: auto;
    }

    &__item {
        position: relative;
        display: flex;
        align-items: center;
        list-style: none;
        border-bottom: 1px solid map-get($colors, border-color-hover);

        &:last-child {
            border-bottom: 0;
        }
    }

    &__item-text {
        flex-grow: 1;
        padding-top: 0.75rem;
        padding-right: 3rem;
        padding-bottom: 0.75rem;
        padding-left: 1rem;
        overflow: hidden;
        font-size: 1rem;
        line-height: 1.5;
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
        background-color: transparent;
        border: 0;
        cursor: pointer;
        transition: $trs;

        &:hover,
        &:focus {
            background-color: map-get($colors, bg-hover);
        }

        .select__item.focused & {
            cursor: initial;
        }

        .select__item.selected & {
            background-color: map-get($colors, select-bg);

            &:hover,
            &:focus {
                background-color: map-get($colors, select-bg-hover);
            }
        }
    }

    &__item-btn {
        position: absolute;
        top: 50%;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        padding: 0;
        font-size: 1rem;
        background-color: transparent;
        border: 0;
        transform: translateY(-50%);
        cursor: pointer;
        transition: $trs;

        &--edit {
            right: 1.5rem;

            &:hover,
            &:focus {
                color: map-get($colors, blue);
            }

            .select__item.focused & {
                &:hover,
                &:focus {
                    color: map-get($colors, green);
                }
            }
        }

        &--remove {
            right: 0.25rem;

            &:hover,
            &:focus {
                color: map-get($colors, red);
            }
        }

        &[disabled] {
            pointer-events: none;
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
