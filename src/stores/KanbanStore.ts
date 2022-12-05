import { nextTick, ref } from 'vue';
import { defineStore } from 'pinia';
import type { IColumn } from "../types/Column"
import type { Toast } from "../types/Toast";
import type { ITask } from "../types/Task";
import Repository from "@/services/apiService/APIFactory";
const ColumnRepository = Repository.get("columns");
const TasksRepository = Repository.get("tasks");

export const useKanbanStore = defineStore('KanbanStore', () => {
  const listOfColumns = ref<IColumn[]>([]);
  const toast = ref<null | Toast>(null);
  const columnUpdated = ref(null);

  // Call toast component
  const setToast = (type: string, text: string) => {
    toast.value = {
      type,
      text
    };

    setTimeout(() => {
      toast.value = null;
    }, 1500);
  }

  // Fetch columns
  const fetchColumns = async () => {
    const { data } = await ColumnRepository.get()
    listOfColumns.value = data.sort(
      (a: IColumn, b: IColumn) => a.columnPosition - b.columnPosition
    )
  }

  // Add column api call 
  const addColumn = async (name: string, columnPosition: number) => {
    const form: IColumn = {
      title: name,
      boardId: 0,
      columnPosition,
    }
    await ColumnRepository.create(form);
    await fetchColumns();
    setToast('success', 'Successfully added column');
  }

  // Remove column
  const removeColumn = async (id?: number) => {
    await ColumnRepository.delete(id)
    await fetchColumns();
    setToast('success', 'Successfully removed column');
  }

  // rearrange columns when doing drag and drop like in jira
  const reArrangeColumns = async (id: number, columnPosition: number) => {
    const form = {
      columnPosition
    }
    await ColumnRepository.patch(form, id);
    setToast('info', 'Successfully rearranged columns');
  }

  // Edit columns
  const editColumn = async (id: number, name: string, columnPosition: number) => {
    const form: IColumn = {
      title: name,
      boardId: 0,
      columnPosition,
      id
    }
    await ColumnRepository.update(form, id);
    await fetchColumns();
    setToast('info', 'Edited column');
  }

  // Add task api call
  const addTask = async (columnId: number, title: string, taskPosition: number) => {
    const form: ITask = {
      title,
      description: '',
      columnId,
      taskPosition,
    }
    await TasksRepository.create(form);
    setToast('success', 'Successfully added task');
  }

  // Fetch tasks
  const fetchTasks = async (columnId: number) => {
    const { data } = await TasksRepository.get(columnId)
    return data;
  }

  const fetchSingleTask = async (id: number) => {
    const { data } = await TasksRepository.getSingle(id)
    return data;
  }

  // Move task actions
  const moveTask = async (id: number, columnId?: number, taskPosition?: number) => {
    const form = {
      columnId,
      taskPosition
    }
    const { data } = await TasksRepository.patch(form, id);
    setToast('info', 'Successfully moved task');
    return data;
  }

  // Remove task
  const removeTask = async (id: number) => {
    await TasksRepository.delete(id)
    await fetchColumns();
    setToast('success', 'Successfully removed a task')
  }

  // Edit task
  const editTask = async (form: ITask) => {
    const { data } = await TasksRepository.update(form);
    setToast('info', 'Edited Task');
    return data;
  }

  return {
    fetchColumns,
    addColumn,
    removeColumn,
    editColumn,
    reArrangeColumns,
    addTask,
    fetchTasks,
    fetchSingleTask,
    removeTask,
    moveTask,
    editTask,
    setToast,
    toast,
    listOfColumns,
    columnUpdated
  }
});