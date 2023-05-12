<script lang="ts">
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    return {
      ArrowUp,
      ArrowDown
    }
  },
  props: {
    element: {
      default: () => {
        return window;
      }
    }
  },
  methods: {
    scrollTopFn () {
      const target = this.element;
      target.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    scrollBottomFn () {
      const target = this.element;
      let body = this.element || document.querySelector('body');
      target.scrollTo({
        top: body.scrollHeight,
        behavior: "smooth"
      });
    }
  }
})
</script>
<template>
  <div class="scroll-btn">
    <el-button type="primary" @click="scrollTopFn" circle :icon="ArrowUp" size="large"></el-button>
    <el-button type="primary" @click="scrollBottomFn" circle :icon="ArrowDown" size="large"></el-button>
  </div>
</template>
<style lang="scss" scoped>
.scroll-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  button {
    margin: 3px;
  }
}
</style>