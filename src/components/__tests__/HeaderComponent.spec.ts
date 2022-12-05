import { mount, VueWrapper } from "@vue/test-utils";
import HeaderComponent from "@/components/HeaderComponent.vue";

describe("header component", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(HeaderComponent, {
      shallow: true,
    });
  });

  // Simple test for header component
  
  it("should render correctly", () => {
    expect(wrapper.text()).toContain("Kanban Board");
  });

  it("should match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
