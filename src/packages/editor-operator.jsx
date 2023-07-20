/* eslint-disable */
import { defineComponent, inject } from 'vue';
import {
  ElForm,
  ElFormItem,
  ElButton,
  ElInputNumber,
  ElInput,
  ElOption,
  ElSelect,
  ElColorPicker,
} from 'element-plus';
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
          content.push(
            Object.entries(component.props).map(([propName, propConfig]) => {
              console.log('type = ' + propConfig.type);

              return (
                <ElFormItem label={propConfig.label}>
                  {{
                    input: () => <ElInput />,
                    color: () => <ElColorPicker />,
                    select: () => (
                      <ElSelect>
                        {propConfig.options.map((opt) => {
                          return (
                            <ElOption
                              label={opt.label}
                              value={opt.value}
                            ></ElOption>
                          );
                        })}
                      </ElSelect>
                    ),
                  }[propConfig.type]()}
                </ElFormItem>
              );
            })
          );
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
