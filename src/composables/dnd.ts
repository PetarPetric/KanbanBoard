import { ref } from "vue"
import { useKanbanStore } from "@/stores/KanbanStore";
import type { ITask } from "@/types/Task";
import type { IColumn } from "@/types/Column";

const dragStartItem = ref<IColumn | ITask | null>(null);
const goingOverItem = ref<IColumn | ITask | null>(null);
const moveDirection = ref<string>('');
const goingOverPosition = ref<number>();
const draggingItemType = ref<{ column: boolean; task: boolean }>({
  column: false,
  task: false
})
const startLoc = ref<number>();
const insertionArrayConstant = ref<ITask[] | null>([])
const insertionArrayIDConstant = ref()

export function useDragAndDrop(): any {
  const store = useKanbanStore();

  const startDrag = (item: IColumn | ITask, e: MouseEvent) => {
    // check if we are dragging column
    'columnPosition' in item ? draggingItemType.value['column'] = true : draggingItemType.value['task'] = true;
    // set start location
    draggingItemType.value.column ? startLoc.value = e.clientX : startLoc.value = e.clientY

    // set dragging
    dragStartItem.value = item;
  };

  // When element droped decide which one was dropped
  function dropElement(item: ITask | IColumn, pos: number, removalArray?: ITask[]) {
    if (draggingItemType.value.column) {
      finishDragColumn(item as IColumn, pos)
    } else {
      finishDragTask(item as ITask, pos, removalArray as ITask[])
    }
    // reset drag items
    dragStartItem.value = null;
    goingOverItem.value = null;
    draggingItemType.value.column = false
    draggingItemType.value.task = false
  }


  // Moving task between columns
  const finishDragTask = async (item: ITask, pos: number, removalArray: ITask[]) => {
    const positionToRemove = pos;
    const positionToInsert = (goingOverItem.value as ITask).taskPosition || 0;


    // If in this dragging iteration we have value and we are not moving same position
    if (insertionArrayIDConstant.value && goingOverItem.value?.id !== item.id) {
      // mutate array to which we are moving and array from which we are moving
      removalArray?.splice(positionToRemove, 1);
      insertionArrayConstant.value?.splice(positionToInsert, 0, item);

      // rearrange tasks give them new position in the columns that we changed
      removalArray?.forEach((task: ITask, index) => {
        task.taskPosition = index
        store.moveTask(task.id as number, task.columnId, task.taskPosition)
      })

      insertionArrayConstant.value?.forEach((task: ITask, index: number) => {
        task.taskPosition = index;
        store.moveTask(task.id as number, insertionArrayIDConstant.value, task.taskPosition)
      });
    }
  }

  // moving columns
  const finishDragColumn = async (item: IColumn, pos: number) => {
    if (goingOverPosition.value != pos) {
      store.listOfColumns?.splice(pos, 1);
      store.listOfColumns?.splice(goingOverPosition.value as number, 0, item);
      store.listOfColumns?.forEach(async (element: IColumn, index: number) => {
        element.columnPosition = index;
        await store.reArrangeColumns(element.id as number, element.columnPosition);
      });
    }
  };

  const onDragOver = (item: IColumn | ITask, pos: number, e: MouseEvent, insertionArray?: ITask[], insertionArrayID?: number) => {
    // When dragging set over what are we going
    goingOverItem.value = item;
    goingOverPosition.value = pos;

    // array where we are going to insert items
    if (insertionArray)
      insertionArrayConstant.value = insertionArray as ITask[];
    if (insertionArrayID)
      insertionArrayIDConstant.value = insertionArrayID;
    // check in which direction we are dragging
    if (draggingItemType.value.column && startLoc.value) {
      moveDirection.value = startLoc.value > e.clientX ? "left" : "right";
    } else if (startLoc.value) {
      moveDirection.value = startLoc.value > e.clientY ? "up" : "down";
    }
  };

  return {
    startDrag,
    onDragOver,
    dropElement,
    dragStartItem,
    moveDirection,
    goingOverItem,
    goingOverPosition,
    draggingItemType,
  }
}