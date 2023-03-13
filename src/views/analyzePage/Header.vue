<script lang="ts">
import { ref } from 'vue';
import { filterStore, viewStore } from "../../stores/mainStore"
import { ViewTypes } from "../../utils/enum"
export default {
  setup(){
    const insFilterStore = filterStore();
    const insViewStore = viewStore();
    let input = ref('');
    let viewType = ref(ViewTypes.Text);
    const inputFilter = (keyword:string) => {
      input.value = keyword
      insFilterStore.customKeyWord = keyword
    }
    const switchView = (view:any) => {
      insViewStore.viewType = view
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
      inputFilter, switchView,
      
    }
  }
}
</script>
<template>
  <div class="log-view__header">
    <div class="back-home">
      <el-button>
      <router-link to="/">home</router-link>
    </el-button>
    </div>
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
  </div>
</template>
<style scoped>
.log-view__header{
  /* display: grid; */
  /* grid-template-columns: 100px 400px 400px 400px; */
  /* grid-template-rows: 100px 200px; */
  /* grid-gap: 20px; */
  display: flex;
  flex-direction: row;
  padding: 10px;
}
.back-home {
  height: 40px;
  line-height: 40px;
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
</style>