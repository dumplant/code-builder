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
  render: ({ props }) => (
    <el-form-item label={props.text || '输入框'}>
      <el-input
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
});

registerConfig.register({
  label: '表格',
  preview: () => (
    <el-table style="width: 250px">
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
