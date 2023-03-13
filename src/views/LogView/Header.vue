<script lang="ts">
import { ref } from 'vue';
import { filterStore } from "../../stores/mainStore"
export default {
  setup(){
    const headerFilterStore = filterStore();
    let input = ref('')
    const inputFilter = (keyword:string) => {
      input.value = keyword
      headerFilterStore.customKeyWord = keyword
    }
    return {
      input, inputFilter, headerFilterStore
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
    <div class="keyword-filter">
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
.keyword-filter__span {
  min-width: 60px;
}
</style>