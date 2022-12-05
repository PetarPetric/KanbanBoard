<script setup lang="ts">
import { useKanbanStore } from "@/stores/KanbanStore";
import type { ITask } from "@/types/Task";
import { computed } from "@vue/reactivity";
import { BIconTrash } from "bootstrap-icons-vue";
import { useRouter } from "vue-router";
import { useDragAndDrop } from "@/composables/dnd";
// Emit events
const emit = defineEmits(["removedTask"]);
// Router
const $router = useRouter();
// Store
const store = useKanbanStore();
// Props
const props = defineProps<{
  singleTask: ITask;
  taskIndex: number;
  taskColumn: ITask[];
}>();

const {
  startDrag,
  onDragOver,
  dropElement,
  dragStartItem,
  goingOverItem,
  draggingItemType,
} = useDragAndDrop();

// Get title of column in task
const columnTitle = computed(() => {
  return store.listOfColumns.find(
    (item) => item.id == props.singleTask.columnId
  );
});

// Go To task details
const openTaskDetails = () => {
  $router.push({ path: `/task/${props.singleTask.id}` });
};

// Remov task function
const removeTask = async () => {
  await store.removeTask(props.singleTask.id as number);
  emit("removedTask");
};
</script>

<template>
  <div class="placeholder">
    <div
      draggable="true"
      @dragstart.stop="startDrag(props.singleTask, $event)"
      @dragover.stop="onDragOver(props.singleTask, props.taskIndex, $event)"
      @dragend.stop="
        dropElement(props.singleTask, props.taskIndex, props.taskColumn)
      "
      @click="openTaskDetails"
      data-test="single-task"
      class="single-task"
      :class="[
        {
          'drag-item':
            props.singleTask.id === dragStartItem?.id &&
            goingOverItem &&
            draggingItemType.task,
        },
      ]"
    >
      <div data-test="single-task-header" class="single-task__header">
        <span class="text-secondary">{{ props.singleTask.title }}</span>
        <button
          data-test="btn-remove"
          @click.stop="removeTask"
          class="btn btn--remove"
        >
          <BIconTrash />
        </button>
      </div>
      <div data-test="single-task-body" class="single-task__body">
        <span class="text-secondary">{{ columnTitle?.title }} column</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/task.scss";
.placeholder {
  border-radius: 3px;
  margin: 1rem 0;
  height: 80px;
  position: relative;
  background-color: transparent;

  .single-task {
    position: absolute;
  }
}
.down {
  transform: translateY(80px);
}

.up {
  transform: translateY(-80px);
}
</style>
