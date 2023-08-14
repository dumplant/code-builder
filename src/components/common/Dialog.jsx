import { defineComponent, reactive, createVNode, render } from 'vue';
import { ElButton, ElDialog, ElInput } from 'element-plus';
const DialogComponent = defineComponent({
  props: {
    option: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const state = reactive({
      option: props.option,
      isShow: false,
    });
    ctx.expose({
      showDialog(option) {
        state.option = option;
        state.isShow = true;
      },
    });
    const onCancel = () => {
      state.isShow = false;
    };
    const onConfirm = () => {
      state.isShow = false;
      state.option.onConfirm && state.option.onConfirm(state.option.content);
    };
    return () => {
      return (
        <ElDialog v-model={state.isShow} title={state.option.title}>
          {{
            default: () => (
              <ElInput
                type="textarea"
                v-model={state.option.content}
                rows={10}
              ></ElInput>
            ),
            footer: () =>
              state.option.footer && (
                <div>
                  <ElButton onClick={onCancel}>取消</ElButton>
                  <ElButton type="primary" onClick={onConfirm}>
                    提交
                  </ElButton>
                </div>
              ),
          }}
        </ElDialog>
      );
    };
  },
});
let vnode;
export function $dialog(option) {
  if (!vnode) {
    let el = document.createElement('div');
    vnode = createVNode(DialogComponent, { option });

    document.body.appendChild((render(vnode, el), el));
  }
  let { showDialog } = vnode.component.exposed;
  showDialog(option);
}
