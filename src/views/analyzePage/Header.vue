<script lang="ts">
import { ref } from 'vue';
import { logDataStore, filterStore, viewStore } from "../../stores/mainStore"
import { mapState } from "pinia";
import { ViewTypes } from "../../utils/enum"
import DropView from "../DropView.vue"
export default {
  components: { DropView },
  setup(){
    const insViewStore = viewStore();
    const insFilterStore = filterStore();
    
    let viewType = ref(ViewTypes.Text);
    const switchView = (view:any) => {
      insViewStore.viewType = view
    }

    const emptyThreads = () => {
      insFilterStore.emptyThreadIDs();
    }
    const viewOptions = [
      {
        value: ViewTypes.Text,
        label: "文本"
      }, {
        value: ViewTypes.Thread,
        label: "线程"
      }
    ]
    return {
      insFilterStore,
      viewType, 
      viewOptions,
      switchView, emptyThreads
    }
  },
  computed: {
    ...mapState(logDataStore, {
      getLogFileName: 'getLogFileName'
    })
  }
}
</script>
<template>
  <div class="log-view__header">
    <div class="grid-item"> 日志名称: {{ getLogFileName }} </div>
    <div class="grid-item view-selector">
      <span class="">视图:</span>
      <el-select v-model="viewType" class="m-2" @change="switchView">
        <el-option 
          v-for="(item, key) in viewOptions"
          :key="key"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </div>
    <drop-view :size="'small'"></drop-view>
  </div>
</template>
<style scoped lang="scss">
@import "src/assets/colors.scss";
.log-view__header{
  display: grid;
  grid-template-columns: repeat(2, 300px) 1fr 1fr;
  grid-template-rows: repeat(1, 60px);
  grid-gap: 20px;
  padding: 10px 0;
  .grid-item {
    padding: 0 10px;
    font-size: 16px;
    line-height: 60px;
    background: $bg3;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .view-selector > span {
  }
  .back-home {
    height: 40px;
    line-height: 40px;
  }
}
#grid-bg {
  grid-column-start: 2;
  grid-column-end: 5; 
}
.keyword-filter {
  display: flex;
  flex-direction: row;
}
span {
  min-width: 60px;
  height: 40px;
  line-height: 40px;
  padding: 5px;
}
.thread-options {
  display: flex;
  flex-direction: row;
}
</style>