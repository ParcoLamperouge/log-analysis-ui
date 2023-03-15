<script lang="ts">
import { ref } from 'vue';
import { logDataStore, filterStore, viewStore } from "../../stores/mainStore"
import { mapState } from "pinia";
import { ViewTypes } from "../../utils/enum"
// import ThreadFilter from './ThreadFilter.vue';
export default {
  // components: { ThreadFilter },
  setup(){
    const insFilterStore = filterStore();
    const insViewStore = viewStore();
    let input = ref('');
    let viewType = ref(ViewTypes.Text);
    const inputFilter = (keyword:string) => {
      input.value = keyword
      insFilterStore.customKeyword = keyword
    }
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
      input, viewType, 
      viewOptions,
      inputFilter, switchView, emptyThreads
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
    <div> 日志名称： {{ getLogFileName }} </div>
    <div class="view-selector">
      <span class="view-selector__span">视图选择</span>
      <el-select v-model="viewType" class="m-2" @change="switchView">
        <el-option 
          v-for="item in viewOptions"
          :key="item.key"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </div>
    <div class="keyword-filter" v-if="viewType === 'text'">
      <span class="keyword-filter__span">筛选：</span>
      <el-input class="w-50 m-2" v-model="input" placeholder="Please input" @change="inputFilter" @input="inputFilter"/>
    </div>
    <!-- <div class="thread-options" v-if="viewType ==='thread' ">
      <thread-filter :ref="`thread-filter-${index}`" v-for="(i,index) in Array(5)" :key="index" :threadNum="index"></thread-filter>
      <el-button @click="emptyThreads">reset</el-button>
    </div> -->
  </div>
</template>
<style scoped lang="scss">
.log-view__header{
  /* display: grid; */
  /* grid-template-columns: 100px 400px 400px 400px; */
  /* grid-template-rows: 100px 200px; */
  /* grid-gap: 20px; */
  display: flex;
  flex-direction: row;
  padding: 10px;

  .back-home {
    height: 40px;
    line-height: 40px;
  }
}
.keyword-filter {
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  height: 40px;
  line-height: 40px;;
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