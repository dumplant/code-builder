/* eslint-disable */
import { computed, defineComponent, inject } from 'vue';

export default defineComponent({
  props: {
    block: { type: Object },
    formData: { type: Object },
  },
  setup(props) {
    // const blockStyles = computed(() => ({
    //   top: `${props.block.top}px`,
    //   left:`${props.block.left}px`,
    //   zIndex:`${props.block.zIndex}`,
    // }))
    const config = inject('config');

    return () => {
      const component = config.componentMap[props.block.type];
      console.log('component', component);
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
      });
      return <div class="editor-block">{renderComponent}</div>;
      // return <div class="editor-block" style={blockStyles.value}>
      //   {renderComponent}
      // </div>
    };
  },
});
