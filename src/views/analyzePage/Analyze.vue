<script lang="ts">
import { ref } from "vue";
import { logDataStore, viewStore }from "../../stores/mainStore";
import LogHeader from './Header.vue';
import TextView from './TextView.vue';
import ThreadView from './ThreadView.vue';
import { mapState } from 'pinia';
export default {
  components: {LogHeader, TextView, ThreadView},
  setup() {
    const logStoreIns = logDataStore();
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
  </div>
</template>

<style scoped>
.analyze{
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
</style>