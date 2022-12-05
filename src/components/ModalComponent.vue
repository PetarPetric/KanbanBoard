<script setup lang="ts">
import { BIconXLg } from "bootstrap-icons-vue";
const emits = defineEmits(["closeModal"]);

function closeModal() {
  emits("closeModal");
}
</script>

<template>
  <div class="modal__wrapper">
    <div class="modal__container">
      <button @click.prevent="closeModal" class="modal__btn-close">
        <BIconXLg />
      </button>
      <div class="modal__body">
        <slot name="body" />
      </div>
      <div class="modal__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/modal.scss";
</style>
