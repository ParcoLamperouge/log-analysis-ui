<script lang="ts">
import { ref } from "vue";
import { logDataStore, filterStore, viewStore }from "../../stores/mainStore";
import LogHeader from './Header.vue';
import TextView from './TextView.vue';
import ThreadView from './ThreadView.vue';
import { mapState } from 'pinia';
export default {
  components: {LogHeader, TextView, ThreadView},
  setup() {
    const logStoreIns = logDataStore();
    const filterStoreIns = filterStore();
    // const insViewStore = viewStore();
    // 重置筛选项
    filterStoreIns.$reset();
    let dataArray = ref<string[]>([]);
    return {
      dataArray, logStoreIns, 
    }
  },
  mounted () {
    this.dataArray = this.logStoreIns.logFile.data;
  },
  watch: {
    // TODO 文件更新没做好
    dropCount () {
      // this.dataArray = file.data;
    }
  },
  computed: {
    ...mapState(logDataStore, {
      dropCount: "dropCount"
    }),
    ...mapState(filterStore, {
      filterKeyWord: 'customKeyword'
    }),
    ...mapState(viewStore, {
      viewType: 'viewType'
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
  <div class="analyze">
    <LogHeader></LogHeader>
    <TextView v-if="viewType === 'text'"></TextView>
    <ThreadView v-if="viewType === 'thread'"></ThreadView>
  </div>
</template>

<style scoped>
.analyze{
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>