import { defineComponent, inject } from 'vue';
import { ElForm, ElFormItem, ElButton, ElInputNumber } from 'element-plus';
export default defineComponent({
  props: {
    block: { type: Object },
    data: { type: Object },
  },
  setup(props) {
    const config = inject('config');
    return () => {
      let content = [];
      if (!props.block) {
        content.push(
          <>
            <ElFormItem label="容器宽度">
              <ElInputNumber></ElInputNumber>
            </ElFormItem>
            <ElFormItem label="容器高度">
              <ElInputNumber></ElInputNumber>
            </ElFormItem>
          </>
        );
      } else {
        let component = config.componentMap[props.block.type];
        if (component && component.props) {
          console.log(component.props);
        }
      }
      return (
        <ElForm labelPosition="top" style="padding:30px">
          {content}
          <ElFormItem>
            <ElButton type="primary">应用</ElButton>
            <ElButton>重置</ElButton>
          </ElFormItem>
        </ElForm>
      );
    };
  },
});
