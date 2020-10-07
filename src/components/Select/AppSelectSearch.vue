<template>
    <div class="select-search">
        <label class="select-search__label">
            <i class="fas fa-search"></i>
            <input
                v-model.trim="query"
                class="select-search__input"
                type="text"
                placeholder="Search..."
            >

            <button
                v-if="query"
                class="select-search__clear-btn"
                type="button"
                @click.prevent="query = ''"
            >
                <i class="fas fa-times"></i>
            </button>
        </label>

        <button
            v-if="additionAvailable"
            :disabled="addBtnDisabled || !query"
            class="select-search__add-btn"
            type="button"
            @click="$emit('add')"
        >
            <i class="fas fa-plus-circle"></i>
        </button>
    </div>
</template>

<script>
export default {
    name: 'AppSelectSearch',
    inject: {
        additionAvailable: {
            default: false,
        },
    },
    props: {
        search: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        query: {
            get() {
                return this.search.query
            },
            set(value) {
                this.$emit('input', value)
            },
        },
        addBtnDisabled() {
            return this.search.addBtnDisabled
        },
    },
}
</script>

<style lang="scss" scoped>
.select-search {
    position: relative;
    display: flex;
    width: 100%;
    border-bottom: 1px solid map-get($colors, border-color-hover);

    &__label {
        position: relative;
        display: flex;
        flex-grow: 1;
        align-items: center;

        & > i {
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
        padding-right: 3rem;
        padding-bottom: 0.75rem;
        padding-left: 3rem;
        font-size: 1rem;
        line-height: 1.5;
        border: 0;
    }

    &__clear-btn {
        position: absolute;
        top: 50%;
        right: 1rem;
        width: 1rem;
        height: 1rem;
        padding: 0;
        background-color: transparent;
        border: 0;
        transform: translateY(-50%);
        cursor: pointer;
        transition: $trs;

        &:hover,
        &:focus {
            color: map-get($colors, red);
        }
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
}
</style>
