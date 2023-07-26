<template>
  <div class="app">
    <Editor v-model="state"></Editor>
  </div>
</template>

<script>
/* eslint-disable */
import data from './data.json';
import { provide, ref } from 'vue';
import Editor from './packages/editor'
import { registerConfig as config } from "./utils/editor-config"
export default {
  components: {
    Editor
  },
  setup() {
    const state = ref(data);
    provide('config', config);
    const formData = ref({
      username: '123',
      password: '456',
    })
    provide('formData', formData)
    return {
      state
    }
  }
}
</script>

<style lang="scss"></style>
