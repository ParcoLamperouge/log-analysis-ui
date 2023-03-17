<script lang="ts">
import { ref } from "vue";
import { viewStore, logDataStore, filterStore }from "../../stores/mainStore";
import { mapState } from 'pinia';
export default {
  setup() {
    const insLogStore = logDataStore();
    const insFilterStore = filterStore();
    let input = ref('');
    const inputFilter = (keyword:string) => {
      input.value = keyword
      insFilterStore.customKeyword = keyword
    }
    // 重置筛选项
    insFilterStore.$reset();
    let dataArray = ref<string[]>([]);
    return {
      input, dataArray, 
      insLogStore,
      insFilterStore,
      inputFilter
    }
  },
  mounted () {
    this.updateView();
  },
  computed: {
    ...mapState(viewStore, {
      viewType: "viewType",
    }),
    ...mapState(filterStore, {
      filterKeyWord: 'customKeyword'
    }),
    ...mapState(logDataStore, {
      dropCount: "dropCount",
    }),
    showList () {
      return this.dataArray.filter((log:string) => {
        return log.indexOf(this.insFilterStore.customKeyword) > -1
      })
    }
  },
  watch: {
    dropCount () {
      this.updateView();
    }
  },
  methods: {
    updateView () {
      this.dataArray = this.insLogStore.logFile.data;
    }
  }
}

</script>
<template>
  <div class="text-view">
    <div class="text-filter" v-if="viewType === 'text'">
      <span class="">筛选:</span>
      <el-input class="w-50 m-2" v-model="input" placeholder="Please input" @change="inputFilter" @input="inputFilter"/>
    </div>
    <div class="text-view__list">
      <div class="text-view__item" v-for="(line, i) in showList" :key="i">
        {{ line }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-view{
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 90vw;
  .text-filter {
    margin: 10px;
    max-width: 400px;
  }
}
.text-view__list {
  margin: 10px;
  display: flex;
  flex-direction: column;
}
</style>