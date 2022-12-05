<script setup lang="ts">
import { useKanbanStore } from "@/stores/KanbanStore";
const store = useKanbanStore();
</script>

<template>
  <div
    v-if="store.toast"
    class="toasts-item c-toasts"
    :class="['c-toasts__item', 'c-toasts__item--' + store.toast.type]"
  >
    <span class="c-toasts__item-text">{{ store.toast.text }}</span>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/toast.scss";
</style>
