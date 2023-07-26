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
import { ElButton } from 'element-plus';
export default defineComponent({
  components: {
    EditorBlock,
  },
  props: {
    modelValue: { type: Object },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const previewRef = ref(false);
    const editorRef = ref(true);
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
      useFocus(data, previewRef);
    const { commands } = useCommand(data, focusData);
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
              // data.value = JSON.parse(text);
              commands.updateContainer(JSON.parse(text));
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
              commands.updateContainer(JSON.parse(generateJson));
            },
          });
        },
      },
      { label: '删除', handler: () => commands.delete() },
      {
        label: () => (previewRef.value ? '编辑' : '预览'),
        handler: () => {
          previewRef.value = !previewRef.value;
          clearBlockFocus();
        },
      },
      {
        label: () => '关闭',
        handler: () => {
          editorRef.value = false;
          clearBlockFocus();
        },
      },
    ];

    return () =>
      !editorRef.value ? (
        <>
          <div style={'float:right'}>
            <ElButton type="primary" onClick={() => (editorRef.value = true)}>
              返回编辑
            </ElButton>
          </div>
          <div
            class="editor-container-canvas__content"
            style="width: 900px;height: 650px; margin:0"
          >
            {data.value.blocks.map((block, index) => (
              <EditorBlock
                class={'editor-block-preview'}
                block={block}
              ></EditorBlock>
            ))}
          </div>
        </>
      ) : (
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
              const label =
                typeof btn.label == 'function' ? btn.label() : btn.label;
              return (
                <div class="editor-top-button" onClick={btn.handler}>
                  <el-button>{label}</el-button>
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
                    class={
                      block.focus
                        ? 'editor-block-focus'
                        : previewRef.value
                        ? 'editor-block-preview'
                        : ''
                    }
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
