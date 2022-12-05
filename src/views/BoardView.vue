<script setup lang="ts">
import { BIconPlusLg, BIconCheckLg, BIconXLg } from "bootstrap-icons-vue";
import { ref, nextTick } from "vue";
import { useKanbanStore } from "@/stores/KanbanStore";
import SingleColumnComponent from "@/components/SingleColumnComponent.vue";
import ToastComponent from "@/components/ToastComponent.vue";

const store = useKanbanStore();
const addingNewColumn = ref(false);
const columnTitle = ref("");
const inputError = ref(false);
const input = ref<null | HTMLInputElement>(null);

const handleAddingNewColumn = async (arg: boolean) => {
  addingNewColumn.value = arg;
  await nextTick();
  if (input.value) {
    input.value.focus();
  }
};

const addNewColumn = async () => {
  // add new column to last place as columnIndex
  if (columnTitle.value) {
    let newColumnIndex = store.listOfColumns?.length + 1;
    await store.addColumn(columnTitle.value, newColumnIndex);
    columnTitle.value = "";
    addingNewColumn.value = false;
    inputError.value = false;
  } else {
    inputError.value = true;
  }
};

store.fetchColumns();
</script>

<template>
  <transition name="toast" tag="div">
    <ToastComponent v-if="store.toast" />
  </transition>
  <section class="columns">
    <SingleColumnComponent
      v-for="(column, i) in store.listOfColumns"
      :key="column.id"
      :column-data="column"
      :column-index="i"
    />
    <div class="columns__actions" :class="{ 'adding-bg': addingNewColumn }">
      <div v-if="addingNewColumn">
        <input
          :class="{ 'input--error': inputError }"
          ref="input"
          placeholder="Column name"
          v-model="columnTitle"
          type="text"
        />
        <div class="columns__options">
          <button @click="addNewColumn" data-test="btn-check" class="btn">
            <BIconCheckLg />
          </button>
          <button
            @click="handleAddingNewColumn(false)"
            data-test="btn-close"
            class="btn"
          >
            <BIconXLg />
          </button>
        </div>
      </div>
      <button
        v-else
        @click="handleAddingNewColumn(true)"
        data-test="btn-add"
        class="btn"
      >
        <BIconPlusLg />
      </button>
    </div>
  </section>
  <router-view />
</template>

<style lang="scss" scoped>
@import "@/styles/board.scss";
</style>
