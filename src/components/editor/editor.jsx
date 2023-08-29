/* eslint-disable */
import { computed, defineComponent, inject, ref } from 'vue';
import './editor.scss';
import EditorBlock from './editor-block';
import EditorOperator from './editor-operator';
import deepcopy from 'deepcopy';
import { useMenuDragger } from '@/utils/useMenuDragger';
import { useCommand } from '@/utils/useCommnad';
import { $dialog } from '@/components/common/Dialog';
import getResponse from '@/utils/GetResponse';
import { getJson } from '@/utils/GetJson';
import { useFocus } from '@/utils/userFocus';
import { userBlockDragger } from '@/utils/useBlockDragger';
import { ElButton, ElNotification, ElDrawer } from 'element-plus';
import { $dropdown, DropdownItem } from '@/components/common/Dropdown';
export default defineComponent({
  components: {
    EditorBlock,
  },
  props: {
    modelValue: { type: Object },
    formData: { type: Object },
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
    const containerStyles = computed(() => ({
      width: (data.value.container ? data.value.container.width : 800) + 'px',
      height: (data.value.container ? data.value.container.height : 450) + 'px',
    }));
    console.log(containerStyles, containerStyles);
    // const containerStyles = {
    //   width: '700px',
    //   height: '800px',
    // };
    const containerRef = ref(null);

    const { dragstart, dragend } = useMenuDragger(containerRef, data);
    let { mousedown } = userBlockDragger();
    let { blockMouseDown, clearBlockFocus, focusData, lastSelectBlock } =
      useFocus(data, previewRef);
    const { commands } = useCommand(data, focusData);
    console.log(lastSelectBlock);
    const formData = inject('formData');
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
              // console.log('text', JSON.parse(text));
              // data.value.blocks = JSON.parse(text);
              // console.log('导入data.value', data.value);
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
            content: JSON.stringify(
              (() => {
                data.value.blocks.map((block) => {
                  if ('focus' in block) {
                    delete block.focus;
                  }
                });
                return data.value;
              })()
            ),
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
              try {
                loading.value = true;
                let res = await getResponse(JSON.stringify(data.value), text);
                let generateJson = getJson(res);
                commands.updateContainer(JSON.parse(generateJson));
              } catch (error) {
                (() => {
                  ElNotification({
                    title: 'Error',
                    message: '发生错误请重试',
                    type: 'error',
                  });
                })();
              } finally {
                loading.value = false;
              }
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
      // {
      //   label: 'JSON',
      //   handler: () => {
      //     drawer.value = true;
      //   },
      // },
    ];

    const onContextMenuBlock = (e, block, index) => {
      e.preventDefault();
      $dropdown({
        el: e.target,
        content: () => (
          <>
            <DropdownItem
              label="上移"
              onClick={() => {
                commands.up(block);
              }}
            ></DropdownItem>
            <DropdownItem
              label="下移"
              onClick={() => {
                commands.down(block);
              }}
            ></DropdownItem>
          </>
        ),
      });
    };
    const loading = ref(false);
    console.log('formData', formData.value);
    return () =>
      !editorRef.value ? (
        <>
          <div style={'float:right;margin-right:1rem;'}>
            <ElButton type="primary" onClick={() => (editorRef.value = true)}>
              返回编辑
            </ElButton>
            <div class="model">{JSON.stringify(formData.value)}</div>
          </div>
          <div
            class="editor-container-canvas__content"
            style={containerStyles.value}
          >
            {data.value.blocks.map((block, index) => (
              <EditorBlock
                class={'editor-block-preview'}
                block={block}
                // formData={props.formData}
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

          <div class="editor-container">
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
            <div class="editor-container-canvas">
              <div
                class="editor-container-canvas__content"
                style={containerStyles.value}
                ref={containerRef}
                onMousedown={(e) => clearBlockFocus(e)}
                v-loading={loading.value}
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
                    // formData={props.formData}
                    onMousedown={(e) => blockMouseDown(e, block, index)}
                    onContextmenu={(e) => onContextMenuBlock(e, block, index)}
                  ></EditorBlock>
                ))}
              </div>
            </div>
          </div>
          <div class="editor-right">
            <EditorOperator
              block={lastSelectBlock.value}
              data={data.value}
              updateContainer={commands.updateContainer}
              updateBlock={commands.updateBlock}
            ></EditorOperator>
          </div>
        </div>
      );
  },
});
