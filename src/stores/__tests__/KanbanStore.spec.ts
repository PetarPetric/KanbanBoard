import { setActivePinia, createPinia, } from "pinia";
import { useKanbanStore } from "@/stores/KanbanStore";

describe("kanban store tests", () => {
  // inferred store type
  let store: any;

  beforeEach(() => {
    setActivePinia(createPinia())
    // create an instance of the data stores
    store = useKanbanStore();
  })

  it("should be empty at first", () => {
    expect(store.listOfColumns.length).toEqual(0)
  });
});