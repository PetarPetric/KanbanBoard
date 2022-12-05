import { mount, VueWrapper, flushPromises } from "@vue/test-utils";
import { createRouterMock, injectRouterMock } from 'vue-router-mock'
import { createTestingPinia } from '@pinia/testing'
import { useKanbanStore } from "@/stores/KanbanStore";
import TaskView from "@/views/TaskView.vue";

describe("task view component", () => {
  let wrapper: VueWrapper<any>;
  let store: any;
  const router = createRouterMock()

  beforeEach(() => {
    injectRouterMock(router);
    wrapper = mount(TaskView, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })],
      }
    });
    store = useKanbanStore();
  });

  afterEach(async () => {
    wrapper.unmount()
  })

  it('calls correct api', async () => {
    await wrapper.vm.$router.push({ path: '/task/3' })
    expect(wrapper.vm.$route.path).toBe(`/task/3`);
    expect(store.fetchSingleTask).toHaveBeenCalledTimes(1);
    expect(store.fetchSingleTask).toHaveBeenLastCalledWith(wrapper.vm.$route.params.id);
  })

  it('should render correctly', async () => {
    await wrapper.vm.$router.push({ path: '/task/3' })
    expect(wrapper.html()).toMatchSnapshot();
  })
});
