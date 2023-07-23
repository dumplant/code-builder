import deepcopy from 'deepcopy';
import { onUnmounted } from 'vue';
import { events } from './events';

export function useCommand(data) {
  const state = {
    current: -1,
    queue: [], // 存放所有操作命令
    commands: {}, // 制作命令和执行功能的一个映射表 undo, redo
    commandArray: [],
    destroyArray: [],
  };
  const registry = (command) => {
    state.commandArray.push(command);
    state.commands[command.name] = () => {
      // 命令名字对应执行函数
      const { redo, undo } = command.execute();
      redo();
      if (!command.pushQueue) {
        return;
      }
      let { queue, current } = state;

      if (queue.length > 0) {
        queue = queue.slice(0, current + 1);
        state.queue = queue;
      }

      queue.push({ redo, undo });
      state.current = current + 1;
      console.log(queue);
    };
  };
  registry({
    name: 'redo',
    shortcut: 'ctrl+y',
    execute() {
      return {
        redo() {
          let item = state.queue[state.current + 1];
          if (item) {
            item.redo && item.redo();
            state.current++;
          }
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
          if (state.current == -1) {
            return;
          }
          let item = state.queue[state.current];
          if (item) {
            item.undo && item.undo();
            state.current--;
          }
        },
      };
    },
  });
  registry({
    name: 'drag',
    pushQueue: true,
    init() {
      console.log('init');
      this.before = null;

      const start = () => (this.before = deepcopy(data.value.blocks));

      const end = () => state.commands.drag();

      events.on('start', start);
      events.on('end', end);
      return () => {
        events.off(start);
        events.off(end);
      };
    },
    execute() {
      let before = this.before;
      let after = data.value.blocks;
      return {
        redo() {
          data.value = { ...data.value, blocks: after };
        },
        undo() {
          data.value = { ...data.value, blocks: before };
        },
      };
    },
  });

  (() => {
    state.commandArray.forEach(
      (cmd) => cmd.init && state.destroyArray.push(cmd.init())
    );
  })();

  onUnmounted(() => {
    state.destroyArray.forEach((fn) => fn && fn());
  });

  return state;
}
