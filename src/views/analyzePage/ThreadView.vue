<script lang="ts">
import { isRef, ref } from "vue";
import { logDataStore, filterStore }from "../../stores/mainStore";
import { mapState } from 'pinia';
import { logDataItem } from '../../class/logFile';
const THREAD_ID_KEY = 'threadID'
// 提取所有中括号tag
const regSplitTag = /(?<=\[)(.+?)(?=\])/g;
// 仅提取有效字段
const regTimeTag = /(?<=\[)((0?[0-9])|(1[0-9]|2[0-3])):(([1-5][0-9])|(0?[0-9])):(([1-5][0-9])|(0?[0-9]))\.([0-9]{3})(?=\])/;
const regLevelTag = /(?<=\[)([A-Z])(?=\])/;
const regThreadTag = /(?<=\[threadID:)(([0-9]+))(?=\])/;
const regFileTag = /(?<=\[)(([\w]+\.cpp):([0-9]+))(?=\])/;
const regMethodTag = /(?<=\[)([\w]+)(?=\])/;
// 提取tag括号+字段

const regTimeWithSquareBrackets = /\[((0?[0-9])|(1[0-9]|2[0-3])):(([1-5][0-9])|(0?[0-9])):(([1-5][0-9])|(0?[0-9]))\.([0-9]{3})\]/;
const regLevelWithSquareBrackets = /\[([A-Z])\]/;
const regThreadWithSquareBracket = /\[threadID:(([0-9]+))\]/;
const regMethodWithSquareBracket = /\[([\w]{5,})\]/;
const regFileWithSquareBracket = /\[(([\w]+\.cpp):([0-9]+))\]/;


function matchDefault(str:string, reg:RegExp, defaultVal:any = "") {
  return str.match(reg) ? str.match(reg)[0] : defaultVal;
}
export default {
  setup() {
    const logStoreIns = logDataStore();
    const filterStoreIns = filterStore();  
    // 重置筛选项
    filterStoreIns.$reset();
    let dataArray = ref<any>([]);
    let panelsArray = ref<any>([]);
    // let timeStampArray = ref<string>([]);
    const updateFileData = () => {
      dataArray.value = logStoreIns.logFile.data;
      return dataArray;
    }
    const convertToClass = (rawArr) => {
      // list 提取 时间戳 去重
      let arr = [];
      let dataArr = isRef(rawArr) ? rawArr.value : rawArr;
      for (let i = 0; i < dataArr.length; i++) {
        let str = dataArr[i];
        let timestamp = matchDefault(str, regTimeTag);
        let level = matchDefault(str, regLevelTag);
        let methodName = matchDefault(str, regMethodTag);
        let fileTag = str.match(regFileTag) ? str.match(regFileTag) : "";
        let fileName = "";
        let lineNum = 0;
        if (fileTag.length >= 4) {
          // 有效的文件：行号tag
          fileName = fileTag[2];
          lineNum = fileTag[3];
        }
        let threadID = matchDefault(str, regThreadTag);
        // 替换掉这些字段，剩下的就是正文
        const removeArr = [matchDefault(str, regTimeWithSquareBrackets), matchDefault(str, regLevelWithSquareBrackets), matchDefault(str, regFileWithSquareBracket), matchDefault(str, regThreadWithSquareBracket), matchDefault(str, regMethodWithSquareBracket)];
        console.log('removeArr', removeArr);

        let text = str;
        removeArr.forEach(square => {
          text = text.replace(square, '');
        })
        const args =[timestamp, level, threadID, fileName, lineNum, methodName, text];
        console.log("[ThreadView] convertToClass", ...args)
        let item = new logDataItem(i, str, ...args);
        arr.push(item);
      }
      console.log('[ThreadView] instance', arr)
      return arr;
    }
    return {
      logStoreIns,
      dataArray, panelsArray,
      updateFileData,
      convertToClass
    }
  },
  mounted () {
    this.convertToClass(this.updateFileData());
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
      this.convertToClass(this.updateFileData());
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