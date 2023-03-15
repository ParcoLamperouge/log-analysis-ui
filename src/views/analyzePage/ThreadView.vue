<script lang="ts">
import { ref, defineComponent } from "vue";
import { logDataStore, filterStore }from "../../stores/mainStore";
import { mapState } from 'pinia';
import reg from './regExp';
import { logDataItem } from '../../class/logFile';
import { getValFromProxy, deepClone, deDuplicate } from "../../utils/tools"
const THREAD_ID_KEY = 'tid:';
const MAIN_TEXT_SPLIT_KEY = '--->';

function matchDefault(str:string, reg:RegExp, defaultVal:any = "") {
  return str.match(reg) ? str.match(reg)[0] : defaultVal;
}
// 将已经识别的tag从字符串中移除
function removeRecognizedTag (str:string) {
  let newStr = str;
  const removeArr = [
    matchDefault(str, reg.regTimeWithSquareBrackets), 
    matchDefault(str, reg.regLevelWithSquareBrackets), 
    matchDefault(str, reg.regFileWithSquareBracket), 
    matchDefault(str, reg.regThreadWithSquareBracket), 
    matchDefault(str, reg.regMethodWithSquareBracket)
  ];
  console.log('removeArr', removeArr);
  removeArr.forEach(square => {
    newStr = newStr.replace(square, '');
  }) 
  return newStr;
}
export default defineComponent({
  setup() {
    const logStoreIns = logDataStore();
    const filterStoreIns = filterStore();
    
    // 重置筛选项
    filterStoreIns.$reset();
    
    let panelsArray = ref<any>([]);
    let timeStampArray = ref<string[]>([]);
    let allThreadIDArray = ref<string[]>([]);
    let drawData = ref<any>({});

    return {
      logStoreIns,
      panelsArray,
      timeStampArray,
      allThreadIDArray,
      drawData
    }
  },
  mounted () {
    this.updateView();
  },
  computed: {
    ...mapState(filterStore, {
      threadIDs: "threadIDs"
    }),
    ...mapState(logDataStore, {
      dropCount: "dropCount",
    }),
    ...mapState(logDataStore, {
      getLogData: "getLogData"
    }),
    threadInputArray () {
      return this.threadIDs.filter(n => !!n)
    },
    // 输入了多少个线程名称 - 需要多少个面板
    threadInputNum () {
      return this.threadInputArray.length;
    },
    slicedThreadArray () {
      return this.allThreadIDArray.slice(0, 5);
    },
    threadList () {
      if (!this.getLogData) {
        return [];
      }
      return this.getLogData.filter((log:string) => {
        return log.indexOf(THREAD_ID_KEY) > -1
      })
    },
    noThreadList() {
      if (!this.getLogData) {
        return [];
      }
      return this.getLogData.filter((log:string) => {
        return log.indexOf(THREAD_ID_KEY) < 0
      })
    },

  },
  watch: {
    threadInputArray (arr) {
      if (!Array.isArray(arr)) {
        return;
      }
      this.updateView();
    },
    dropCount () {
      this.updateView();
    }
  },
  methods: {
    // 转换为实体类
    convertToClass (rawArr) {
      if (!rawArr) {
        throw new Error("convertToClass input invalid");
      }
      // list 提取 时间戳 去重
      let arr = [];
      let dataArr = getValFromProxy(rawArr);

      console.log("convertToClass", dataArr.length)
      let text = '';
      for (let i = 0; i < dataArr.length; i++) {
        let str = dataArr[i];
        
        // 按分割符，切分tag区域和正文区域, 
        if (str.indexOf(MAIN_TEXT_SPLIT_KEY) > -1) {
          let strSplitArr = str.split(MAIN_TEXT_SPLIT_KEY);
          str = strSplitArr[0];
          text = strSplitArr[1].trim();
        } 
        // 如果没有，则认为是非业务日志，去掉方括号的部分视为正文
        else {
          text = removeRecognizedTag(str);
          let unrecognizedTags = matchDefault(str, reg.regSplitTag);
          // TODO 呈现第三方tag
          console.log("unrecognizedTags", unrecognizedTags);
        }
        let timestamp = matchDefault(str, reg.regTimeTag);
        let level = matchDefault(str, reg.regLevelTag);
        let methodName = matchDefault(str, reg.regMethodTag);
        let fileTag = str.match(reg.regFileTag) ? str.match(reg.regFileTag) : "";
        let fileName = "";
        let lineNum = 0;
        if (timestamp) {
          this.timeStampArray.push(timestamp);
        }
        if (fileTag.length >= 4) {
          // 有效的文件：行号tag
          fileName = fileTag[2];
          lineNum = fileTag[3];
        }
        let threadID = matchDefault(str, reg.regThreadTag);
        if (threadID) {
          this.allThreadIDArray.push(threadID);
        }
        this.allThreadIDArray = Array.from(new Set(this.allThreadIDArray));
        this.allThreadIDArray = this.allThreadIDArray.sort((a, b) => a-b);
        
        const args =[timestamp, level, threadID, fileName, lineNum, methodName, text];
        let item = new logDataItem(i, str, ...args);
        if (item.timestamp.length < 1) {
          break;
        }
        arr.push(item);
      }
      this.timeStampArray = deDuplicate(getValFromProxy(this.timeStampArray));
      return arr;
    },
    generateGridData (instanceArr:logDataItem[]) {
      // 时间轴（纵轴）
      if (this.timeStampArray.length < 0 ) {
        return;
      }
      // 预先生成好容器
      let rowTemplate = {
        other: []
      }
      // 根据有效线程数 (横轴)，动态分配
      this.allThreadIDArray.forEach((e) => {
        rowTemplate[e] = [];
      });
      console.log("allThreadIDArray", this.allThreadIDArray)
      // 最终数据输出容器
      let rowMap = {};

      // 数据分发 - 生成时间轴
      let timestampArr = getValFromProxy(this.timeStampArray);
      timestampArr.forEach(t => {
        let dataObj = deepClone(rowTemplate);
        rowMap[t] = dataObj;
      });
      /*
      rowMap format = {
        '12:00:00.000': {
          thread1: [],
          thread2: [],
          thread3: []
        }
      }
      */
      instanceArr.forEach((ins:logDataItem) => {
        let timestamp = ins.timestamp;
        let threadID = ins.threadID;
        let curObj = rowMap[timestamp];
        if (!threadID) {
          threadID = 'other';
        }
        curObj[threadID].push(ins);
      })
      this.drawData = rowMap;
      return rowMap;
    },
    updateView () {
      this.generateGridData(this.convertToClass(this.getLogData));
    }
  }
})

</script>
<template>
  <div class="thread-view">
    <div class="show-threads">
      有效线程
      <div class="thread" v-for="(thread, t) in [...allThreadIDArray]" :key="t">
        {{thread}}
      </div>
    </div>
    <div class="thread-view__header">
      <div class="timestamp-left header-timestamp">时间戳</div>
      <div class="header-title header-thread" v-for="(thread, t) in [...allThreadIDArray, 'other']" :key="t">线程：{{thread}}</div>
    </div>
    <div class="thread-view__panel">
      <div class="row" v-for="(timestamp, i) in timeStampArray" :key="i">
        <div class="timestamp-left">{{timestamp}}</div>
        <div class="lines-right column" v-for="(lines, j) in drawData[timestamp]" :key="j">
          <div :class="['column-text__line', line.level]" v-for="(line, k) in lines" :key="k">
            <div class="item-params file-name" v-if="line.fileName">{{line.fileName}}</div>
            <div class="item-params" v-if="line.methodName">{{line.methodName}}</div>
            <div class="item-params" v-if="line.text">{{line.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="thread-view__footer"></div>
  </div>
</template>

<style scoped lang="scss">
@import "src/assets/colors.scss";
$header-height: 30px;
.I {
  background: $bg;
}
.W {
  background: $warning;
}
.E {
  background: $error;
}
.thread-view{
  height: 100%;
  width: 100%;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  flex:1;
  .show-threads {
    display: flex;
    width: 100%;
    justify-content: center;
    .thread {
      margin-left: 20px;
    }
  }
  .thread-view__header,
  .thread-view__footer {
    padding: 0 10px;
    text-align: center;
  }
  .thread-view__header {
    display: flex;
    .timestamp-left {
      line-height: $header-height;
    }
    .header-timestamp {
    }
    .header-thread {
      flex:1;
      height: $header-height; 
      line-height: $header-height;
      border: 1px solid $line;
      color: $text-sub;
    }
  }
  .thread-view__footer {
    clear: both;
  }

  .timestamp-left {
    width: 120px;
    overflow: hidden scroll;
    background: $line;
    display: flex;
    justify-content: center;
  }
  .thread-view__panel {
    padding: 0 10px;
    overflow: hidden auto;
    flex-direction: column;
    .row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      border: 1px solid $line;
      .lines-right {
        width: 0;
        flex: 1;
        justify-content: center;
        overflow: auto hidden;
      }
    }
    .column-text__line {
      // max-width: 500px;
      border: 1px solid black;
      margin-bottom: 1px;
      .item-params{
        .file-name {
          color: $main;
        }
      }
      .main-text {

      }
    }
    .thread-view__item {
      max-width: 500px;
    }
  }
    
    
}
</style>