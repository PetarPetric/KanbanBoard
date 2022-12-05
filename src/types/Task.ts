interface ITask {
  id?: number,
  title: string,
  description: string,
  columnId: number
  taskPosition: number,
}

interface IGoingOverTask {
  item: ITask; pos: number; dir: string
}

export type { ITask, IGoingOverTask };