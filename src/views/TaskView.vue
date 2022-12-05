<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useKanbanStore } from "@/stores/KanbanStore";
import ModalComponent from "@/components/ModalComponent.vue";
import type { ITask } from "@/types/Task";
const $route = useRoute();
const $router = useRouter();
const store = useKanbanStore();
const taskData = ref<ITask | null>(null);

const closeModal = () => {
  $router.push("/");
};

const getTaskData = async () => {
  let taskId;
  if ($route?.params?.id) {
    taskId = Number($route.params.id);
  }
  taskData.value = await store.fetchSingleTask(taskId as number);
};

const updateTask = async () => {
  await store.editTask(taskData.value as ITask);
  $router.push("/");
};
onMounted(async () => {
  await getTaskData();
});
</script>

<template>
  <ModalComponent @close-modal="closeModal">
    <template v-slot:body>
      <div v-if="taskData" class="task-details">
        <label for="task-title">Task Title</label>
        <input
          v-if="taskData.title"
          id="task-title"
          placeholder="Task Title"
          v-model="taskData.title"
        />
        <label for="task-description">Task description</label>
        <input
          id="task-description"
          placeholder="Task Description"
          v-model="taskData.description"
        />
        <label for="columns">Task Column</label>
        <select v-model="taskData.columnId" name="columns" id="columns">
          <option
            v-for="column in store.listOfColumns"
            :value="column.id"
            :key="column.id"
          >
            {{ column.title }}
          </option>
        </select>
      </div>
    </template>
    <template v-slot:footer>
      <div class="task-details__footer">
        <button @click="closeModal" class="btn btn--cancel">Cancel</button>
        <button @click="updateTask" class="btn btn--save">Save</button>
      </div>
    </template>
  </ModalComponent>
</template>

<style scoped lang="scss">
@import "@/styles/taskView.scss";
</style>
