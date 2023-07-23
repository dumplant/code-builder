/* eslint-disable */
import { computed, defineComponent, inject, ref } from 'vue';
import './editor.scss';
import EditorBlock from './editor-block';
import EditorOperator from './editor-operator';
import deepcopy from 'deepcopy';
import { useMenuDragger } from './useMenuDragger';
import { useCommand } from './useCommnad';
import { $dialog } from '@/components/Dialog';
import getResponse from './GetResponse';
import { getJson } from './GetJson';
import { useFocus } from './userFocus';
import { userBlockDragger } from './useBlockDragger';
export default defineComponent({
  components: {
    EditorBlock,
  },
  props: {
    modelValue: { type: Object },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const config = inject('config');

    const data = computed({
      get() {
        return props.modelValue;
      },
      set(newValue) {
        ctx.emit('update:modelValue', deepcopy(newValue));
      },
    });
    // const containerStyles = computed(() => ({
    //   width: data.value.container.width + 'px',
    //   height: data.value.container.height + 'px'
    // }))
    const containerStyles = {
      width: '700px',
      height: '800px',
    };
    const containerRef = ref(null);

    const { dragstart, dragend } = useMenuDragger(containerRef, data);
    let { mousedown } = userBlockDragger();
    let { blockMouseDown, clearBlockFocus, focusData, lastSelectBlock } =
      useFocus(data);
    const { commands } = useCommand(data);
    console.log(lastSelectBlock);

    const buttons = [
      { label: '撤销', handler: () => commands.undo() },
      { label: '重做', handler: () => commands.redo() },
      {
        label: '导入',
        handler: () => {
          $dialog({
            title: '导入JSON',
            content: '',
            footer: true,
            onConfirm(text) {
              data.value = JSON.parse(text);
            },
          });
        },
      },
      {
        label: '导出',
        handler: () => {
          $dialog({
            title: '导出JSON',
            content: JSON.stringify(data.value),
            footer: false,
          });
        },
      },
      {
        label: '生成',
        handler: () => {
          $dialog({
            title: 'chat自动生成',
            content: '',
            footer: true,
            async onConfirm(text) {
              console.log(text);
              let res = await getResponse(JSON.stringify(data.value), text);
              let generateJson = getJson(res);
              console.log(generateJson);
              data.value = JSON.parse(generateJson);
            },
          });
        },
      },
    ];

    return () => (
      <div class="editor">
        <div class="editor-left">
          {config.componentList.map((component) => (
            <div
              class="editor-left-item"
              draggable
              onDragstart={(e) => dragstart(e, component)}
              onDragend={dragend}
            >
              <span>{component.label}</span>
              <div>{component.preview()}</div>
            </div>
          ))}
        </div>
        <div class="editor-top">
          {buttons.map((btn, index) => {
            return (
              <div class="editor-top-button" onClick={btn.handler}>
                <el-button>{btn.label}</el-button>
              </div>
            );
          })}
        </div>
        <div class="editor-right">
          <EditorOperator
            block={lastSelectBlock.value}
            data={data.value}
            updateBlock={commands.updateBlock}
          ></EditorOperator>
        </div>
        <div class="editor-container">
          <div class="editor-container-canvas">
            <div
              class="editor-container-canvas__content"
              style="width: 900px;height: 650px"
              ref={containerRef}
              onMousedown={() => clearBlockFocus()}
            >
              {data.value.blocks.map((block, index) => (
                <EditorBlock
                  class={block.focus ? 'editor-block-focus' : ''}
                  block={block}
                  onMousedown={(e) => blockMouseDown(e, block, index)}
                ></EditorBlock>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
