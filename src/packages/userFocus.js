import { computed } from 'vue';
export function useFocus(data) {
  const clearBlockFocus = () => {
    console.log('clear');
    data.value.blocks.forEach((block) => (block.focus = false));
  };
  const blockMouseDown = (e, block) => {
    e.preventDefault();
    e.stopPropagation();
    // block上规划一个属性 focus， 获取焦点还将focus变为true
    if (e.shiftKey) {
      block.focus = !block.focus;
    } else {
      if (!block.focus) {
        clearBlockFocus();
        block.focus = true;
      } else {
        block.focus = false;
      }
    }
  };

  const focusData = computed(() => {
    let focus = [];
    let unfocused = [];
    data.value.blocks.forEach((block) =>
      (block.focus ? focus : unfocused).push(block)
    );
    return { focus, unfocused };
  });

  return {
    blockMouseDown,
    clearBlockFocus,
    focusData,
  };
}
