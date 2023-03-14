<script lang="ts">
  import { ref } from 'vue';
  import { filterStore } from "../../stores/mainStore"
  import { mapState } from 'pinia';
  export default {
    props: {
      threadNum: Number
    },
    components: {},
    setup(props) {
      const insFilterStore = filterStore();
      let input=ref('');
      const inputFilter = (threadID:string) => {
        input.value = threadID
        insFilterStore.setThreadID(props.threadNum, threadID);
        return true;
      }
      return {
        insFilterStore,
        input, inputFilter
      }
    },
    computed: {
      ...mapState(filterStore, {
        threadIDs: "threadIDs"
      })
    },

    watch: {
      threadIDs (newVal) {
        this.input = newVal[this.threadNum]
      }
    },
  }
</script>

<template>
  <div class="thread-filter">
    <span class="keyword-filter__span">线程{{threadNum + 1}}</span>
    {{threadIDs[threadNum]}}
    <el-input class="w-50 m-2" v-model="input" placeholder="Please input" @change="inputFilter" @input="inputFilter"/>
  </div>
</template>
