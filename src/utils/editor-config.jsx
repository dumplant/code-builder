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
  render: () => '渲染文本',
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
  render: () => <ElButton>渲染按钮</ElButton>,
  type: 'button',
  props: {
    text: createInputProp('按钮内容'),
    mode: createSelectProp('按钮类型', [
      { label: '基础', value: '14px' },
      { label: '警告', value: '16px' },
      { label: '成功', value: '18px' },
      { label: '危险', value: '20px' },
    ]),
    size: createSelectProp('按钮大小', [
      { label: '默认', value: '14px' },
      { label: '中等', value: '16px' },
      { label: '小', value: '18px' },
      { label: '极小', value: '20px' },
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
  render: () => (
    <el-form-item label="输入框">
      <el-input />
    </el-form-item>
  ),
  type: 'input',
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
