<script lang="ts">
import { ref } from "vue";
import { logDataStore, filterStore }from "../../stores/mainStore";

import LogHeader from './Header.vue';
import { mapState } from 'pinia';
export default {
  components: {LogHeader},
  setup() {
    const logStoreIns = logDataStore();
    const filterStoreIns = filterStore();
    // 重置筛选项
    filterStoreIns.$reset();
    let dataArray = ref<string[]>([]);
    return {
      dataArray, logStoreIns
    }
  },
  mounted () {
    this.dataArray = this.logStoreIns.logFile.data;
  },
  computed: {
    ...mapState(filterStore, {
      filterKeyWord: 'customKeyWord'
    }),
    showList () {
      console.log('filterKeyWord ', this.filterKeyWord)
      return this.dataArray.filter((log:string) => {
        return log.indexOf(this.filterKeyWord) > -1
      })
    }
  }
}

</script>
<template>
  <div class="log-view">
    <LogHeader></LogHeader>
    <div class="log-view__list">
      <div class="log-view__item" v-for="(line, i) in showList" :key="i">
        {{ line }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-view{
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 90vw;
}
.log-view__list {
  margin: 10px;
  flex-direction: column;
}
</style>

