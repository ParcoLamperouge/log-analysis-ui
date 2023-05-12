<script lang="ts">
import { ref, defineComponent } from 'vue';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

export default defineComponent({
  setup() {
    const target = ref<any>(window);
    return {
      ArrowUp,
      ArrowDown,
      target
    }
  },
  props: {
    element: {
      default: () => {
        return null;
      }
    }
  },
  mounted() {
    if (this.element) {
      this.target = this.element;
    }
  },
  methods: {
    scrollTopFn () {
      this.target.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    scrollBottomFn () {
      let body = this.element || document.querySelector('body');
      this.target.scrollTo({
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