<script lang="ts">
import { ref } from "vue";
import { logDataStore, filterStore }from "../../stores/mainStore";
import { mapState } from 'pinia';
const THREAD_ID_KEY = 'threadID'
export default {
  setup() {
    const logStoreIns = logDataStore();
    const filterStoreIns = filterStore();  
    // 重置筛选项
    filterStoreIns.$reset();
    let dataArray = ref<string[]>([]);
    let panelsArray = ref<any>([]);
    return {
      logStoreIns,
      dataArray, panelsArray
    }
  },
  mounted () {
    this.dataArray = this.logStoreIns.logFile.data;
  },
  computed: {
    ...mapState(filterStore, {
      threadIDs: "threadIDs"
    }),
    threadInputArray () {
      return this.threadIDs.filter(n => !!n)
    },
    // 输入了多少个线程名称 - 需要多少个面板
    threadInputNum () {
      return this.threadInputArray.length;
    },
    threadList () {
      return this.dataArray.filter((log:string) => {
        return log.indexOf(THREAD_ID_KEY) > -1
      })
    },
    noThreadList() {
      return this.dataArray.filter((log:string) => {
        return log.indexOf(THREAD_ID_KEY) < 0
      })
    },

  },
  watch: {
    threadInputArray (arr) {
      if (!Array.isArray(arr)) {
        return;
      }
      // list 提取 时间戳 去重
      let regSplitTag = /(?<=\[)(.+?)(?=\])/g
      

    }
  }
}

</script>
<template>
  <div class="thread-view">
    <div class="panel-wrapper">
      <div class="thread-view__header">THREAD1 {{threadInputNum}}</div>
      <div class="thread-view__list">
        <div class="thread-view__item" v-for="(line, i) in threadList" :key="i">
          {{ line }}
        </div>
      </div>
    </div>
    <div class="panel-wrapper">
      <div class="thread-view__header">THREAD - Others</div>
      <div class="thread-view__list">
        <div class="thread-view__item" v-for="(line, i) in noThreadList" :key="i">
          {{ line }}
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped lang="scss">
.thread-view{
  display: flex;
  flex-direction: row;
  height: 100vh;
  // width: 90vw;
  .panel-wrapper {
    display: flex;
    flex-direction: column;
    flex:1;

    .thread-view__list {
      margin: 10px;
      flex-direction: column;
      .thread-view__item {
        max-width: 500px;

      }
    }
  }
}
</style>