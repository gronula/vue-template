<template>
    <div
        :class="[
            'select-item',
            {
                selected,
                editable,
            },
        ]"
    >
        <input
            v-if="editable"
            v-model.trim="text"
            ref="selectText"
            :disabled="disabled"
            class="select-item__text"
            type="text"
            @focus="$emit('focus', { item })"
            @blur="$emit('blur', { item })"
            @keyup.enter.stop="editItem"
        >
        <button
            v-else
            ref="selectText"
            :disabled="disabled"
            class="select-item__text"
            type="button"
            @focus="$emit('focus', { item })"
            @blur="$emit('blur', { item })"
            @click.stop.prevent="$emit('select', { item })"
        >
            <span>{{ text }}</span>
        </button>

        <button
            :disabled="!text"
            class="select-item__btn select-item__btn--edit"
            type="button"
            @mouseup="editItem"
            @keyup.enter.stop="editItem"
        >
            <i
                :class="[
                    'fas fa-xs',
                    {
                        'fa-check': editable,
                        'fa-pen': !editable,
                    },
                ]"
            ></i>
        </button>
        <button
            :disabled="editable && text === initialText"
            class="select-item__btn select-item__btn--remove"
            type="button"
            @click="$emit(`${editable ? 'revert' : 'remove'}`, { item })"
        >
            <i
                :class="[
                    'fa-xs',
                    {
                        'fas fa-undo': editable,
                        'far fa-times-circle': !editable,
                    },
                ]"
            ></i>
        </button>
    </div>
</template>

<script>
export default {
    name: 'AppSelectItem',
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        text: {
            get() {
                return this.item.text
            },
            set(value) {
                this.$emit('input', {
                    item: this.item,
                    value,
                })
            },
        },
        initialText() {
            return this.item.initialText
        },
        selected() {
            return this.item.selected
        },
        disabled() {
            return this.item.disabled
        },
        editable() {
            return this.item.editable
        },
        focused() {
            return this.item.focused
        },
    },
    watch: {
        focused(value) {
            if (value) {
                this.$refs.selectText.focus()
            }
        },
    },
    methods: {
        async editItem() {
            this.$emit('edit', {
                item: this.item,
                editable: !this.editable,
            })

            await this.$nextTick()

            if (this.editable) {
                this.$refs.selectText.focus()
            } else {
                this.$emit('input', {
                    item: this.item,
                    value: this.text,
                    needUpdateInititalText: true,
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.select-item {
    display: flex;
    align-items: center;
    width: 100%;

    &__text {
        display: flex;
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

        & > * {
            display: inline-block;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
        }

        .select-item.editable & {
            cursor: initial;
        }

        .select-item.selected & {
            background-color: map-get($colors, select-bg);

            &:hover,
            &:focus {
                background-color: map-get($colors, select-bg-hover);
            }
        }
    }

    &__btn {
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

            .select-item.editable & {
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
}
</style>
