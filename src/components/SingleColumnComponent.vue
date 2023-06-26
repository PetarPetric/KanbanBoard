<script setup lang="ts">
import SingleTask from "./SingleTaskComponent.vue";
import { useKanbanStore } from "@/stores/KanbanStore";
import { useDragAndDrop } from "@/composables/dnd";
import { nextTick, computed, ref, watch } from "vue";
import type { IColumn } from "@/types/Column";
import type { ITask } from "@/types/Task";
import {
  BIconXLg,
  BIconPencilSquare,
  BIconCheckLg,
  BIconPlusLg,
} from "bootstrap-icons-vue";
// Store
const store = useKanbanStore();
// Props
const props = defineProps<{
  columnData: IColumn;
  columnIndex: number;
}>();

// DND Composable
const {
  startDrag,
  onDragOver,
  dropElement,
  dragStartItem,
  goingOverItem,
  draggingItemType,
  moveDirection,
  goingOverPosition,
} = useDragAndDrop();

// Column data
const columnTitle = ref("");
const editingColumn = ref(false);
const columnTitleRef = ref<null | HTMLInputElement>(null);
const taskTitleRef = ref<null | HTMLInputElement>(null);

// Tasks data
const addingNewTask = ref(false);
const taskTitle = ref("");
const columnTasks = ref<ITask[]>([]);

// Initialize editing column action
const handleEditColumn = async () => {
  columnTitle.value = props.columnData.title;
  editingColumn.value = true;
  await nextTick();
  if (columnTitleRef.value) {
    columnTitleRef.value.focus();
  }
};

// Handle close button in column actions
const handleCloseBtn = async () => {
  if (editingColumn.value) {
    editingColumn.value = false;
  } else {
    await store.removeColumn(props.columnData?.id);
  }
};

// Edit column action
const editColumn = async () => {
  await store.editColumn(
    props.columnData.id as number,
    columnTitle.value,
    props.columnData.columnPosition
  );
  editingColumn.value = false;
  columnTitle.value = "";
};

// Handle adding task state
const handleAddingTask = async (arg: boolean) => {
  addingNewTask.value = arg;
  await nextTick();
  if (taskTitleRef.value) {
    taskTitleRef.value.focus();
  }
};

// Add task call
const addTask = async () => {
  if (taskTitle.value) {
    let newIndex = columnTasks.value?.length + 1;
    await store.addTask(
      props.columnData.id as number,
      taskTitle.value,
      newIndex
    );
    taskTitle.value = "";
    addingNewTask.value = false;
  }
  fetchTasks();
};

// Fetch Tasks
const fetchTasks = async () => {
  const data = await store.fetchTasks(props.columnData.id as number);
  columnTasks.value = data?.sort(
    (a: ITask, b: ITask) => a.taskPosition - b.taskPosition
  );
};

fetchTasks();
// Number of tasks to show in column
const numberOfTasks = computed(() => {
  if (columnTasks.value && columnTasks.value.length)
    return columnTasks.value.length ? `${columnTasks.value.length} issue` : "";
  else return "";
});

// Animation handling computed method
const handleAnimation = computed(() => {
  if (
    moveDirection.value === "left" &&
    (dragStartItem.value as IColumn)?.columnPosition > 0 &&
    props.columnData.columnPosition <
      (dragStartItem.value as IColumn)?.columnPosition &&
    props.columnData.columnPosition >= goingOverPosition.value
  ) {
    return "all right";
    // if we are moving mouse to right move columns to left
  } else if (
    moveDirection.value === "right" &&
    (dragStartItem.value as IColumn)?.columnPosition <
      store.listOfColumns.length - 1 &&
    props.columnData.columnPosition >
      (dragStartItem.value as IColumn)?.columnPosition &&
    props.columnData.columnPosition <= goingOverPosition.value
  ) {
    return "all left";
  } else return "";
});
</script>

<template>
  <div
    draggable="true"
    @dragend.stop="dropElement(columnData, props.columnIndex)"
    @dragover.stop="
      onDragOver(
        columnData,
        props.columnIndex,
        $event,
        columnTasks,
        columnData.id
      )
    "
    @dragstart.stop="startDrag(columnData, $event)"
    class="column__wrapper"
    data-test="column-wrapper"
    :class="[
      {
        'drag-item':
          columnData.id === dragStartItem?.id &&
          goingOverItem &&
          draggingItemType.column,
        all: draggingItemType.column,
      },
      handleAnimation,
    ]"
  >
    <div class="column__header">
      <input
        ref="columnTitleRef"
        v-model="columnTitle"
        v-if="editingColumn"
        type="text"
      />
      <h5 v-else-if="props?.columnData" class="column__header text-secondary">
        {{ props.columnData.title }} {{ numberOfTasks }}
      </h5>
      <div class="column__header__actions">
        <button
          v-if="editingColumn"
          @click="editColumn"
          data-test="btn-check"
          class="btn"
        >
          <BIconCheckLg />
        </button>
        <button
          v-else
          @click="handleEditColumn"
          data-test="btn-edit"
          class="btn"
        >
          <BIconPencilSquare />
        </button>
        <button @click="handleCloseBtn" data-test="btn-close" class="btn">
          <BIconXLg />
        </button>
      </div>
    </div>
    <div class="column__body">
      <SingleTask
        @removed-task="fetchTasks"
        v-for="(task, i) in columnTasks"
        :single-task="task"
        :task-column="columnTasks"
        :key="i"
        :task-index="i"
      />
      <div v-if="!addingNewTask" class="add-task">
        <button @click="handleAddingTask(true)" class="btn btn--add-task">
          <BIconPlusLg />
          <span class="text-secondary">Create new task</span>
        </button>
      </div>
      <div
        v-else
        :style="`${addingNewTask ? 'display: flex' : ''}`"
        class="actions"
      >
        <input ref="taskTitleRef" v-model="taskTitle" type="text" />
        <button @click="addTask" class="btn btn--check">
          <BIconCheckLg />
        </button>
        <button @click="handleAddingTask(false)" class="btn btn--close">
          <BIconXLg />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/singleColumn.scss";
</style>
