<script lang="ts">
import { ref } from "vue";
import { logDataStore, viewStore }from "../../stores/mainStore";
import LogHeader from './ViewHeader.vue';
import TextView from './TextView.vue';
import ThreadView from './ThreadView.vue';
import { _throttle } from "../../utils/tools"; 
import { mapState } from 'pinia';
import {
  ArrowUp,
  ArrowDown,
} from '@element-plus/icons-vue'
export default {
  components: {LogHeader, TextView, ThreadView},
  setup() {
    const insLogStore = logDataStore();
    let dataArray = ref<string[]>([]);
    return {
      dataArray, insLogStore, 
      ArrowUp,
      ArrowDown
    }
  },
  mounted () {
    this.dataArray = this.insLogStore.logFile.data;
    
    this.scrollTopFn = _throttle(this.scrollTop, 1000, false);
    this.scrollBottomFn = _throttle(this.scrollBottom, 1000, false);
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
    ...mapState(viewStore, {
      viewType: 'viewType'
    }),
  }
}

</script>
<template>
  <div class="analyze">
    <LogHeader></LogHeader>
    <TextView v-if="viewType === 'text'"></TextView>
    <ThreadView v-if="viewType === 'thread'"></ThreadView>
    <div class="scroll-btn">
      <el-button type="primary" @click="scrollTopFn" circle :icon="ArrowUp" size="large"></el-button>
      <el-button type="primary" @click="scrollBottomFn" circle :icon="ArrowDown" size="large"></el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.analyze{
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  .scroll-btn {
    position:absolute;
    bottom: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    button {
      margin: 3px;
    }
  }
}
</style>