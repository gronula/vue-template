<template>
    <div class="select-search">
        <label class="select-search__label">
            <i class="fas fa-search"></i>
            <input
                v-model.trim="searchQuery"
                class="select-search__input"
                type="text"
                placeholder="Search..."
            >
        </label>

        <button
            :disabled="!search"
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
    props: {
        search: String,
    },
    computed: {
        searchQuery: {
            get() {
                return this.search
            },
            set(value) {
                this.$emit('update:search', value)
            },
        },
    },
}
</script>

<style lang="scss" scoped>
.select-search {
    display: flex;
    width: 100%;
    border-bottom: 1px solid map-get($colors, border-color-hover);

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
}
</style>
