<script lang="ts">
import { defineComponent } from 'vue';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

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
      let target = this.element || window;
      if (!target || !target.scrollTo) {
        return;
      }
      target.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    scrollBottomFn () {
      let target = this.element.scrollTo ? this.element : window;
      let body = this.element.scrollHeight ? this.element : document.querySelector('body');
      if (!target || !body) {
        return;
      }
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