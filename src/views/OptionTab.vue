<script lang="ts">
import { ref } from "vue";
import { filterStore }from "@/stores/mainStore";

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
  &.default {
    color: $text-desc;
    border: 1px solid $text-desc;
    &:hover {
      color: $bg;
      background: $text-desc;
    }
    &.active {
      color: $text;
      border: 1px solid $text;
      &:hover {
        color: $bg;
        background: $text-desc;
      }
    }
  }
  &.main {
    background: $main-disabled;
    &.active {
      background: $main;
    }
  }
  &.warning {
    background: $warning-disabled;
    &:hover {
      background: $warning-hover;
    }
    &.active {
      background: $warning;
      
      &:hover {
        background: $warning-hover;
      }
    }
  }
  &.success {
    background: $success-disabled;
    
    &:hover {
      background: $success-hover;
    }
    &.active {
      background: $success;
      &:hover {
        background: $success-hover;
      }
    }
  }
  &.error {
    background: $error-disabled;
    &:hover {
      background: $error-hover;
    }
    &.active {
      background: $error;
      &:hover {
        background: $error-hover;
      }
    }
  }
}
</style>