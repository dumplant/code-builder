import { computed, ref } from 'vue';
export function useFocus(data, previewRef) {
  const selectIndex = ref(-1);
  const lastSelectBlock = computed(() => data.value.blocks[selectIndex.value]);
  const clearBlockFocus = () => {
    data.value.blocks.forEach((block) => (block.focus = false));
    selectIndex.value = -1;
  };
  const blockMouseDown = (e, block, index) => {
    if (previewRef.value) {
      return;
    }
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
    selectIndex.value = index;
    console.log(lastSelectBlock);
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
    lastSelectBlock,
  };
}
