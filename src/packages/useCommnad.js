export function useCommand() {
  const state = {
    current: -1,
    queue: [], // 存放所有操作命令
    commands: {}, // 制作命令和执行功能的一个映射表 undo, redo
    commandArray: [],
  };
  const registry = (command) => {
    state.commandArray.push(command);
    state.commands[command.name] = () => {
      // 命令名字对应执行函数
      const { redo } = command.execute();
      redo();
    };
  };
  registry({
    name: 'redo',
    shortcut: 'ctrl+y',
    execute() {
      return {
        redo() {
          console.log('重做');
        },
      };
    },
  });
  registry({
    name: 'undo',
    shortcut: 'ctrl+z',
    execute() {
      return {
        redo() {
          console.log('撤销');
        },
      };
    },
  });

  return state;
}
