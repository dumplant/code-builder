/* eslint-disable */
import { computed, defineComponent, inject } from 'vue';

export default defineComponent({
  props: {
    block: { type: Object },
    formData: { type: Object },
  },
  setup(props) {
    const config = inject('config');
    console.log('in editor-block', props.block);
    function render(type) {
      const component = config.componentMap[type];
      const renderComponent = component.render({
        props: props.block.props,
        model: Object.keys(component.model || {}).reduce((prev, modelName) => {
          const formData = inject('formData'); //拿到元素
          let propName = props.block.model[modelName];
          prev[modelName] = {
            modelValue: formData.value[propName], //formData中对应的值 如username ：admin ，modelValue就是admin
            'onUpdate:modelValue': (v) => (formData.value[propName] = v),
          };
          return prev;
        }, {}),
        children: props.block.children,
      });
      return renderComponent;
    }
    return () => {
      const renderComponent = render(props.block.type);
      return <div class="editor-block">{renderComponent}</div>;
    };
  },
});
