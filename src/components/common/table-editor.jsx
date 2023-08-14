import deepcopy from 'deepcopy';
import { ElButton, ElTag } from 'element-plus';
import { defineComponent, computed } from 'vue';
import { $tableDialog } from '@/components/common/TableDialog';
export default defineComponent({
  props: {
    propConfig: { type: Object },
    modelValue: { type: Array },
  },
  emits: ['updata:modelValue'],
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue || [];
      },
      set(newValue) {
        ctx.emit('update:modelValue', deepcopy(newValue));
      },
    });
    const add = () => {
      $tableDialog({
        config: props.propConfig,
        data: data.value,
        onConfirm: (newValue) => {
          data.value = newValue; //当点击确认时 更新数据
        },
      });
    };
    return () => {
      return (
        <div>
          {!data.value ||
            (data.value.length === 0 && (
              <ElButton onClick={add}>添加</ElButton>
            ))}
          {(data.value || []).map((item) => (
            <ElTag onClick={add}>{item[props.propConfig.table.label]}</ElTag>
          ))}
        </div>
      );
    };
  },
});
