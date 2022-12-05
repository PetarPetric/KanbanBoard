import { mount, VueWrapper, flushPromises } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing'
import { useKanbanStore } from "@/stores/KanbanStore";
import SingleColumnComponent from "@/components/SingleColumnComponent.vue";
import SingleTaskComponent from "@/components/SingleTaskComponent.vue"

describe("single column component", () => {
  let wrapper: VueWrapper<any>;
  let store: any;

  beforeEach(() => {
    wrapper = mount(SingleColumnComponent as any, {
      props: {
        columnData: {
          title: "New Stage",
          boardId: 0,
          columnPosition: 0,
          id: 10
        },
      },
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
        })],
      }
    });

    store = useKanbanStore();
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render children correctly', async () => {
    // Mock tasks

    wrapper.vm.columnTasks = [{
      title: "First task",
      description: "",
      columnId: 10,
      id: 7,
      taskPosition: 0,
    },
    {
      title: "Second Task",
      description: "",
      columnId: 10,
      id: 8,
      taskPosition: 1,
    },
    {
      title: "Random Task",
      description: "",
      columnId: 10,
      id: 9,
      taskPosition: 2,
    },]

    // wait for dom to update

    await flushPromises();

    expect(wrapper.findAllComponents(SingleTaskComponent).length).toEqual(3)


    expect(wrapper.findAll('[data-test="single-task-header"] span')[0].text()).toContain('First task')
    expect(wrapper.findAll('[data-test="single-task-header"] span')[1].text()).toContain('Second Task')
    expect(wrapper.findAll('[data-test="single-task-header"] span')[2].text()).toContain('Random Task')
  })
});
