<template>
    <ul class="select-list">
        <li
            v-for="(item, i) in items"
            :key="i"
            class="select-list__item"
        >
            <app-select-item
                :item="item"
                v-on="$listeners"
            />
        </li>
    </ul>
</template>

<script>
import AppSelectItem from '@/components/Select/AppSelectItem'

export default {
    name: 'AppSelectList',
    components: {
        AppSelectItem,
    },
    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },
}
</script>

<style lang="scss" scoped>
.select-list {
    max-height: calc(3.1rem * 5 + 1px * 2); // show 5 items
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    overflow: auto;

    &__item {
        position: relative;
        display: flex;
        flex-direction: column;
        list-style: none;
        border-bottom: 1px solid map-get($colors, border-color-hover);

        &:last-child {
            border-bottom: 0;
        }
    }
}
</style>
