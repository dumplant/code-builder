import {
  provide,
  inject,
  ref,
  onMounted,
  reactive,
  computed,
  createVNode,
  defineComponent,
  render,
  onBeforeUnmount,
} from 'vue';

export const DropdownItem = defineComponent({
  props: {
    label: String,
  },
  setup(props) {
    let hide = inject('hide');
    return () => (
      <div class="dropdown-item" onClick={hide}>
        <span>{props.label}</span>
      </div>
    );
  },
});
const DropdownComponent = defineComponent({
  props: {
    option: { type: Object },
  },
  setup(props, ctx) {
    const state = reactive({
      option: props.option,
      isShow: false,
      top: 0,
      left: 0,
    });
    ctx.expose({
      showDropdown(option) {
        state.option = option;
        state.isShow = true;
        let { top, left, height } = option.el.getBoundingClientRect();
        state.top = top + height;
        state.left = left;
      },
    });
    provide('hide', () => (state.isShow = false));
    const classes = computed(() => [
      'dropdown',
      {
        'dropdown-isShow': state.isShow,
      },
    ]);
    const styles = computed(() => ({
      top: state.top + 'px',
      left: state.left + 'px',
    }));
    const el = ref(null);
    const onMousedownDocument = (e) => {
      console.log('mousedownDocument');
      if (!el.value.contains(e.target)) {
        state.isShow = false;
      }
    };
    onMounted(() => {
      console.log('mounted');
      document.addEventListener('mousedown', onMousedownDocument, {
        once: true,
        capture: true,
      });
    });
    onBeforeUnmount(() => {
      console.log('beforeUnmount');
      document.removeEventListener('mousedown');
    });
    return () => {
      return (
        <div class={classes.value} style={styles.value} ref={el}>
          {state.option.content()}
        </div>
      );
    };
  },
});

let vnode;
export function $dropdown(option) {
  if (!vnode) {
    let el = document.createElement('div');
    vnode = createVNode(DropdownComponent, { option });
    console.log('vnode');
    document.body.appendChild((render(vnode, el), el));
  }
  let { showDropdown } = vnode.component.exposed;
  showDropdown(option);
}
