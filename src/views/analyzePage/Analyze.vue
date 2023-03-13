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
  computed: {
    ...mapState(filterStore, {
      filterKeyWord: 'customKeyWord'
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
    <TextView v-show="viewType === 'text'"></TextView>
    <ThreadView v-show="viewType === 'thread'"></ThreadView>
  </div>
</template>

<style scoped>
.analyze{
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 90vw;
}
</style>