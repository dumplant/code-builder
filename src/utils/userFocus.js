import { computed, ref } from 'vue';
export function useFocus(data, previewRef) {
  console.log(data, 'use data');
  const selectIndex = ref(-1);
  const lastSelectBlock = computed(() => {
    if (
      selectIndex.value < 0 ||
      selectIndex.value >= data.value.blocks.length
    ) {
      selectIndex.value = -1;
      return null;
    }
    return data.value.blocks[selectIndex.value];
  });
  const clearBlockFocus = () => {
    data.value.blocks.forEach((block) => {
      if (block.focus) block.focus = false;
    });
    selectIndex.value = -1;
  };
  const blockMouseDown = (e, block, index) => {
    if (previewRef.value) {
      return;
    }
    console.log('e.currentTarget', e.currentTarget);
    console.log('block', block);

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
    console.log('lastSelcetBlock', lastSelectBlock);
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
