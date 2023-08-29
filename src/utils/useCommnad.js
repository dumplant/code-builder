import deepcopy from 'deepcopy';
import { onUnmounted } from 'vue';
import { events } from './events';

export function useCommand(data, focusData) {
  const state = {
    current: -1,
    records: [], // 存放所有操作命令
    commands: {}, // 制作命令和执行功能的一个映射表 undo, redo
    commandArray: [], // 存放所有的command
    destroyArray: [], //存放需要销毁的内容
    maxLimit: 20,
  };
  const registry = (command) => {
    state.commandArray.push(command);
    state.commands[command.name] = (...args) => {
      // 命令名字对应执行函数
      const { redo, undo } = command.execute(...args);
      redo();
      if (!command.pushRecords) {
        return;
      }
      let { records, current } = state;

      if (records.length > 0) {
        records = records.slice(0, current + 1);
        state.records = records;
      }

      records.push({ redo, undo });

      if (records.length >= state.maxLimit) {
        records.shift();
      } else {
        state.current = current + 1;
      }
      console.log('records', records);
    };
  };
  registry({
    name: 'redo',
    shortcut: 'ctrl+y',
    execute() {
      return {
        redo() {
          let item = state.records[state.current + 1];
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
          let item = state.records[state.current];
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
    pushRecords: true,
    init() {
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
  registry({
    name: 'updateContainer',
    pushRecords: true,
    execute(newValue) {
      let state = {
        before: data.value,
        after: newValue,
      };
      console.log('data.value', data.value);
      return {
        redo: () => {
          data.value = state.after;
        },
        undo: () => {
          data.value = state.before;
        },
      };
    },
  });
  registry({
    // 更新某一个组件
    name: 'updateBlock',
    pushRecords: true,
    execute(newBlock, oldBlock) {
      let state = {
        before: data.value.blocks,
        after: (() => {
          let blocks = [...data.value.blocks]; // 拷贝一份用于新block
          const index = data.value.blocks.indexOf(oldBlock); // 找到老的位置
          if (index > -1) blocks.splice(index, 1, newBlock);
          return blocks;
        })(),
      };
      return {
        redo: () => {
          data.value = { ...data.value, blocks: state.after };
        },
        undo: () => {
          data.value = { ...data.value, blocks: state.before };
        },
      };
    },
  });
  registry({
    // 上移某一个组件
    name: 'up',
    pushRecords: true,
    execute(newBlock) {
      let state = {
        before: data.value.blocks,
        after: (() => {
          let blocks = [...data.value.blocks]; // 拷贝一份用于新block
          const index = data.value.blocks.indexOf(newBlock); // 找到老的位置

          if (index > 0) {
            // 交换目标元素和前一个元素的位置
            const temp = blocks[index];
            blocks[index] = blocks[index - 1];
            blocks[index - 1] = temp;
          }
          return blocks;
        })(),
      };
      return {
        redo: () => {
          data.value = { ...data.value, blocks: state.after };
        },
        undo: () => {
          data.value = { ...data.value, blocks: state.before };
        },
      };
    },
  });
  registry({
    // 下移某一个组件
    name: 'down',
    pushRecords: true,
    execute(newBlock) {
      let state = {
        before: data.value.blocks,
        after: (() => {
          let blocks = [...data.value.blocks]; // 拷贝一份用于新block
          const index = data.value.blocks.indexOf(newBlock); // 找到老的位置

          if (index > -1 && index < blocks.length - 1) {
            // 交换目标元素和前一个元素的位置
            const temp = blocks[index];
            blocks[index] = blocks[index + 1];
            blocks[index + 1] = temp;
          }
          return blocks;
        })(),
      };
      return {
        redo: () => {
          data.value = { ...data.value, blocks: state.after };
        },
        undo: () => {
          data.value = { ...data.value, blocks: state.before };
        },
      };
    },
  });
  registry({
    name: 'delete',
    pushRecords: true, // 是否可以加入命令队列
    execute() {
      let state = {
        before: deepcopy(data.value.blocks),
        after: focusData.value.unfocused,
      };

      return {
        redo() {
          data.value = { ...data.value, blocks: state.after }; //存储当前的状态
        },
        undo() {
          data.value = { ...data.value, blocks: state.before }; // 存储之前的状态
        },
      };
    },
  });
  const keyboardEvent = (() => {
    const keyCodes = {
      90: 'z',
      89: 'y',
    };
    const onKeydown = (e) => {
      const { ctrlKey, keyCode } = e;
      let keyString = [];
      if (ctrlKey) keyString.push('ctrl');
      keyString.push(keyCodes[keyCode]);
      keyString = keyString.join('+');

      state.commandArray.forEach(({ shortcut, name }) => {
        if (!shortcut) return; // 没有快捷键
        if (shortcut === keyString) {
          state.commands[name]();
          e.preventDefault();
        }
      });
    };

    const init = () => {
      // 初始化事件
      window.addEventListener('keydown', onKeydown);
      return () => {
        // 销毁事件
        window.removeEventListener('keydown', onKeydown);
      };
    };
    return init;
  })();

  (() => {
    state.destroyArray.push(keyboardEvent());
    state.commandArray.forEach(
      (cmd) => cmd.init && state.destroyArray.push(cmd.init())
    );
  })();

  onUnmounted(() => {
    state.destroyArray.forEach((fn) => fn && fn());
  });

  return state;
}
