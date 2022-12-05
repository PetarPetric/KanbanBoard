import { mount, VueWrapper, flushPromises } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing';
import { useKanbanStore } from "@/stores/KanbanStore";
import SingleTaskComponent from "@/components/SingleTaskComponent.vue";
import { createRouterMock, injectRouterMock } from 'vue-router-mock';

describe("single task component", () => {
  let wrapper: VueWrapper<any>;
  let store: any;
  const router = createRouterMock()
  beforeEach(() => {
    injectRouterMock(router);
    wrapper = mount(SingleTaskComponent as any, {
      shallow: true,
      props: {
        singleTask: {
          id: 5,
          title: 'Just another task',
          description: '',
          columnId: 5,
          taskPosition: 0,
        },
      },
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            KanbanStore: {
              listOfColumns: [
                {
                  title: "Another Task title",
                  boardId: 0,
                  id: 5
                },
                {
                  title: "Random title",
                  boardId: 0,
                  id: 2
                },
                {
                  title: "New Title",
                  boardId: 0,
                  id: 1
                },
              ],
            }
          }
        })]
      }
    });

    store = useKanbanStore();
  });

  afterEach(() => {
    wrapper.unmount()
  })

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should call delete method', async () => {
    const btnRemove = wrapper.find('[data-test="btn-remove"]');
    await btnRemove.trigger('click')
    expect(store.removeTask).toHaveBeenCalledTimes(1)
    expect(store.removeTask).toHaveBeenLastCalledWith(wrapper.vm.props.singleTask.id)
  })

  it('should redirect to modal', async () => {
    await wrapper.find('[data-test="single-task"]').trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith({ path: `/task/${wrapper.vm.props.singleTask.id}` });
    await wrapper.vm.$router.push(`/task/${wrapper.vm.props.singleTask.id}`);
    expect(wrapper.vm.$route.path).toBe(`/task/${wrapper.vm.props.singleTask.id}`)
    expect(wrapper.find('.modal__wrapper')).toBeTruthy()
  })
});
