import { mount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing'
import { useKanbanStore } from "@/stores/KanbanStore";
import BoardView from "@/views/BoardView.vue";

describe("board view component with zero columns displayed", () => {
  let wrapper: VueWrapper<any>;
  let store: any;
  beforeEach(() => {
    wrapper = mount(BoardView, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })],
      }
    });
    store = useKanbanStore();
  });

  afterEach(() => {
    wrapper.unmount()
  })

  it('initializes with zero elements displayed', () => {
    // check that zero cards are displayed
    expect(wrapper.findAll('[data-test="column-wrapper"]').length).toEqual(0);
    expect(wrapper.findAll('[data-test="btn-add"]').length).toEqual(1)
  })
});

describe("board view component with 1 columns in data store", () => {
  let wrapper: VueWrapper<any>;
  let store: any;

  beforeEach(() => {
    wrapper = mount(BoardView, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            KanbanStore: {
              listOfColumns: [
                {
                  title: "Random title",
                  boardId: 0,
                  id: 10
                },
              ],
            }
          }
        })],
      }
    });

    store = useKanbanStore();
  });


  afterEach(() => {
    wrapper.unmount()
  })

  it('initializes with 1 column displayed', () => {
    // check that 1 card cards is displayed
    expect(wrapper.findAll('[data-test="column-wrapper"]').length).toEqual(1);
  })

  it('adds new column action', async () => {
    const addBtn = wrapper.find('[data-test="btn-add"]');
    await addBtn.trigger('click');
    const sendReqBtn = wrapper.find('[data-test="btn-check"]')
    expect(sendReqBtn).toBeTruthy()
    expect(wrapper.findAll('input').length).toEqual(1)
    wrapper.find('input').setValue('New column');
    await sendReqBtn.trigger('click');
    expect(store.addColumn).toHaveBeenCalledTimes(1);
  })

  it('cancels adding new column action', async () => {
    const addBtn = wrapper.find('[data-test="btn-add"]');
    await addBtn.trigger('click');
    const closeBtn = wrapper.find('[data-test="btn-close"]')
    await closeBtn.trigger('click')
    expect(addBtn).toBeTruthy()
  })
});