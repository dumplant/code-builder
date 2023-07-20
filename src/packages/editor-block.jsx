/* eslint-disable */
import { computed, defineComponent, inject } from 'vue';

export default defineComponent({
  props: {
    block: { type: Object },
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
      const renderComponent = component.render();
      return <div class="editor-block">{renderComponent}</div>;
      // return <div class="editor-block" style={blockStyles.value}>
      //   {renderComponent}
      // </div>
    };
  },
});
