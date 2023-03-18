<script lang="ts">
import { ref } from "vue";
import { filterStore }from "../stores/mainStore";

export default {
  props: {
    tabKey: String,
    text: String,
    colorType: String
  },
  setup() {
    const insFilterStore:any =  filterStore();
    let active = ref(true);
    return {
      active,insFilterStore
    }
  },
  mounted () {
    this.active = this.insFilterStore[this.tabKey + 'Switch'];
  },
  methods: {
    switchTab () {
      this.active = !this.active;
      this.insFilterStore[this.tabKey + 'Switch'] = this.active;
    }
  }
}
</script>
<template>
  <div :class="['option-tab', colorType, tabKey, {active: active}]" @click="switchTab">
    {{ text }}
  </div>
</template>
<style scoped lang="scss">
@import "src/assets/colors.scss";
.option-tab {
  padding: 2px 20px;;
  border-radius: 5px;
  max-width: 120px;
  height: 30px;
  line-height: 26px;
  color: $bg;
  text-align: center;
  cursor: pointer;
  &.main {
    background: $main-disabled;
    &.active {
      background: $main;
    }
  }
  &.warning {
    background: $warning-disabled;
    &.active {
      background: $warning;
    }
  }
  &.success {
    background: $success-disabled;
    &.active {
      background: $success;
    }
  }
  &.error {
    background: $error-disabled;
    &.active {
      background: $error;
    }
  }
}
</style>