import { events } from './events';

/* eslint-disable */
export function useMenuDragger(containerRef, data) {
  let currentComponent = null;
  const dragenter = (e) => {
    e.dataTransfer.dropEffect = 'move';
  };
  const dragover = (e) => {
    e.preventDefault();
  };
  const dragleave = (e) => {
    e.dataTransfer.dropEffect = 'none';
  };
  const drop = (e) => {
    let blocks = data.value.blocks;
    data.value = {
      ...data.value,
      blocks: [
        ...blocks,
        {
          type: currentComponent.type,
          props: {},
        },
      ],
    };
    console.log(data.value);
    currentComponent = null;
  };

  const dragstart = (e, component) => {
    //进入，添加移动标识
    //离开，添加禁用标识
    //松手，增加组件
    containerRef.value.addEventListener('dragenter', dragenter);
    containerRef.value.addEventListener('dragover', dragover);
    containerRef.value.addEventListener('dragleave', dragleave);
    containerRef.value.addEventListener('drop', drop);
    currentComponent = component;
    events.emit('start'); // 发布start
  };
  const dragend = (e) => {
    containerRef.value.removeEventListener('dragenter', dragenter);
    containerRef.value.removeEventListener('dragover', dragover);
    containerRef.value.removeEventListener('dragleave', dragleave);
    containerRef.value.removeEventListener('drop', drop);
    events.emit('end'); // 发布end
  };

  return {
    dragstart,
    dragend,
  };
}
