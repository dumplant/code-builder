<template>
  <div class="container" style="min-height: 100%; padding-bottom: 100px;">
    <el-input v-model="input" placeholder="请输入你想生成的页面内容" size="small" class="input"></el-input>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  data() {
    return {
      input: "",
    }
  },
  watch: {},
  computed: {},
  beforeCreate() { },
  created() { },
  beforeMount() { },
  mounted() { },
  beforeUpdate() { },
  updated() { },
  destroyed() { },
  methods: {
    request() { },

  },
  fillter: {},
}
</script>

<style scoped>
.input {}

.container {}
</style>
