import {
  ElOption,
  ElSelect,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElForm,
} from 'element-plus';
// import { useFocus } from '@/utils/userFocus';
import EditorBlock from '@/components/editor/editor-block';
// import Range from '@/components/render/Range';
// let { blockMouseDown } = useFocus();
function createEditorConfig() {
  const componentList = []; // 存储所有的组件
  const componentMap = {}; // 存储了组件键值对
  return {
    componentList,
    componentMap,
    register: (component) => {
      // 向componentList 中添加组件
      componentList.push(component);
      // key: 组件的type属性，value：组件
      componentMap[component.type] = component;
    },
  };
}

const createInputProp = (label) => ({ type: 'input', label });
const createColorProp = (label) => ({ type: 'color', label });
const createSelectProp = (label, options) => ({
  type: 'select',
  label,
  options,
});
const createTableProp = (label, table) => ({
  type: 'table',
  label,
  table,
});

export let registerConfig = createEditorConfig();
registerConfig.register({
  label: '文本',
  preview: () => '预览文本',
  render: ({ props }) => (
    <span style={{ color: props.color, fontSize: props.size }}>
      {props.text || '渲染文本'}
    </span>
  ),
  type: 'text',
  props: {
    text: createInputProp('文本内容'),
    color: createColorProp('文本颜色'),
    size: createSelectProp('字体大小', [
      { label: '14px', value: '14px' },
      { label: '16px', value: '16px' },
      { label: '18px', value: '18px' },
      { label: '20px', value: '20px' },
    ]),
  },
});

registerConfig.register({
  label: '按钮',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: ({ props }) => (
    <el-button type={props.type} size={props.size}>
      {props.text || '渲染按钮'}
    </el-button>
  ),
  type: 'button',
  props: {
    text: createInputProp('按钮内容'),
    type: createSelectProp('按钮类型', [
      { label: '基础', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
      { label: '文本', value: 'text' },
    ]),
    size: createSelectProp('按钮尺寸', [
      { label: '默认', value: 'default' },
      { label: '大', value: 'large' },
      { label: '小', value: 'small' },
    ]),
  },
});

registerConfig.register({
  label: '表单容器',
  preview: () => <el-input />,
  render: ({ props, children }) => {
    return (
      <ElForm
        style="border:1px solid #ccc; padding:0.3rem;border-radius: 5px;"
        label-width="5rem"
        label-position={props.position}
      >
        {(children || []).map((block) => {
          return (
            <EditorBlock
              style="border:1px solid #ccc;"
              block={block}
              // onMousedown={(e) => blockMouseDown(e, block, index)}
            ></EditorBlock>
          );
        })}
      </ElForm>
    );
  },
  type: 'form',
  props: {
    position: createSelectProp('标签位置', [
      { label: '居左', value: 'left' },
      { label: '居右', value: 'right' },
      { label: '居上', value: 'top' },
    ]),
  },
});

registerConfig.register({
  label: '输入框',
  preview: () => (
    <el-form-item label="输入框">
      <el-input />
    </el-form-item>
  ),
  render: ({ props, model }) => (
    <el-form-item label={props.text || '输入框'}>
      <el-input
        {...model.default}
        style={
          props.size === 'small'
            ? 'width:30%'
            : props.size === 'medium'
            ? 'width:60%'
            : ''
        }
      />
    </el-form-item>
  ),
  type: 'input',
  props: {
    text: createInputProp('标签内容'),
    size: createSelectProp('输入框尺寸', [
      { label: '大', value: 'large' },
      { label: '中', value: 'medium' },
      { label: '小', value: 'small' },
    ]),
  },
  model: {
    default: '输入框绑定字段',
  },
});

registerConfig.register({
  label: '单选框',
  preview: () => (
    <ElRadioGroup>
      <ElRadio label="1" size="large">
        Option 1
      </ElRadio>
      <ElRadio label="2" size="large">
        Option 2
      </ElRadio>
    </ElRadioGroup>
  ),
  render: ({ props, model }) => {
    return (
      <el-form-item label={props.text || '单选框'}>
        <ElRadioGroup {...model.default}>
          {(
            props.options || [
              { label: 1, value: 'Option 1' },
              { label: 2, value: 'Option 2' },
            ]
          ).map((item) => {
            console.log('item', item);
            return <ElRadio label={item.label}>{item.value}</ElRadio>;
          })}
        </ElRadioGroup>
      </el-form-item>
    );
  },
  type: 'radio',
  model: {
    default: '单选绑定字段',
  },
  props: {
    text: createInputProp('标签内容'),
    options: createTableProp('单选选项', {
      options: [
        { label: '显示值', field: 'value' },
        { label: '绑定值', field: 'label' },
      ],
      label: 'label',
    }),
  },
});

registerConfig.register({
  label: '多选框',
  preview: () => (
    <ElCheckboxGroup>
      <ElCheckbox label="Option 1" size="large"></ElCheckbox>
      <ElCheckbox label="Option 2" size="large"></ElCheckbox>
    </ElCheckboxGroup>
  ),
  render: ({ props, model }) => {
    return (
      <el-form-item label={props.text || '多选框'}>
        <ElCheckboxGroup {...model.default}>
          {(
            props.options || [{ label: 'Option 1' }, { label: 'Option 2' }]
          ).map((item) => {
            return <ElCheckbox label={item.label}></ElCheckbox>;
          })}
        </ElCheckboxGroup>
      </el-form-item>
    );
  },
  type: 'checkbox',
  model: {
    default: '多选绑定字段',
  },
  props: {
    text: createInputProp('标签内容'),
    options: createTableProp('多选选项', {
      options: [{ label: '显示值', field: 'label' }],
      label: 'label',
    }),
  },
});

registerConfig.register({
  label: '下拉框',
  preview: () => <ElSelect modelValue=""></ElSelect>,
  render: ({ props, model }) => {
    return (
      <el-form-item label={props.text || '下拉框'}>
        <ElSelect {...model.default}>
          {(props.options || []).map((opt, index) => {
            return (
              <ElOption
                label={opt.label}
                value={opt.value}
                key={index}
              ></ElOption>
            );
          })}
        </ElSelect>
      </el-form-item>
    );
  },
  type: 'select',
  props: {
    text: createInputProp('标签内容'),
    options: createTableProp('下拉选项', {
      options: [
        { label: '显示值(label)', field: 'label' },
        { label: '绑定值(value)', field: 'value' },
      ],
      label: 'label',
    }),
  },
  model: {
    default: '下拉绑定字段',
  },
});
// registerConfig.register({
//   label: '范围选择器',
//   preview: () => <Range></Range>,
//   render: ({ model }) => <Range {...{
//     start: model.start.modelValue,
//     'onUpdate:start'
//   }}></Range>,
//   model: {
//     start: '开始字段',
//     end: '结束字段',
//   },
//   type: 'range',
// });
// registerConfig.register({
//   label: '表格',
//   preview: () => (
//     <el-table>
//       <el-table-column prop="date" label="Date" width="180" />
//       <el-table-column prop="name" label="Name" width="180" />
//       <el-table-column prop="address" label="Address" />
//     </el-table>
//   ),
//   render: () => (
//     <el-table>
//       <el-table-column prop="date" label="Date" width="180" />
//       <el-table-column prop="name" label="Name" width="180" />
//       <el-table-column prop="address" label="Address" />
//     </el-table>
//   ),
//   type: 'table',
// });
