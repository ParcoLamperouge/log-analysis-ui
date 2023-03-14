<script lang="ts">
import { ref } from "vue";
import { logDataStore, filterStore }from "../../stores/mainStore";
import { mapState } from 'pinia';
export default {
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
      filterKeyWord: 'customKeyword'
    }),
    showList () {
      return this.dataArray.filter((log:string) => {
        return log.indexOf(this.filterKeyWord) > -1
      })
    }
  }
}

</script>
<template>
  <div class="text-view">
    <div class="text-view__list">
      <div class="text-view__item" v-for="(line, i) in showList" :key="i">
        {{ line }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-view{
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 90vw;
}
.text-view__list {
  margin: 10px;
  flex-direction: column;
}
</style>