import {
  ElOption,
  ElSelect,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
} from 'element-plus';

function createEditorConfig() {
  const componentList = [];
  const componentMap = {};
  return {
    componentList,
    componentMap,
    register: (component) => {
      componentList.push(component);
      componentMap[component.type] = component;
    },
  };
}

export let registerConfig = createEditorConfig();
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
      { label: '大', value: 'big' },
      { label: '中', value: 'medium' },
      { label: '小', value: 'small' },
    ]),
  },
  model: {
    default: '绑定字段',
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
            return <ElRadio label={item.label}>{item.value}</ElRadio>;
          })}
        </ElRadioGroup>
      </el-form-item>
    );
  },
  type: 'radio',
  model: {
    default: '绑定字段',
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
    default: '绑定字段',
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
    default: '绑定字段',
  },
});
registerConfig.register({
  label: '表格',
  preview: () => (
    <el-table>
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  ),
  render: () => (
    <el-table>
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  ),
  type: 'table',
});
