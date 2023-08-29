import { computed, defineComponent } from 'vue';

export default defineComponent({
  porps: {
    start: { tyoe: Number },
    end: { type: Number },
  },
  emits: ['update:start', 'update:end'],
  setup(props, ctx) {
    const start = computed({
      get() {
        return props.start;
      },
      set(newValue) {
        ctx.emit('update:start', newValue);
      },
    });

    const end = computed({
      get() {
        return props.end;
      },
      set(newValue) {
        ctx.emit('update:end', newValue);
      },
    });

    return () => {
      return (
        <div>
          <input v-model={start.value}></input>
          <span>-</span>
          <input v-model={end.value}></input>
        </div>
      );
    };
  },
});
