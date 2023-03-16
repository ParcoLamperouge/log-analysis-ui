<script lang="ts">
import { ref, reactive, defineComponent, h } from "vue";
import { ElNotification } from 'element-plus';
import { logDataStore, filterStore }from "../../stores/mainStore";
import { mapState } from 'pinia';
import reg from './regExp';
import { logDataItem } from '../../class/logFile';
import { getValFromProxy, deepClone } from "../../utils/tools"
import OptionTab from '../../components/OptionTab.vue'
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
  removeArr.forEach(square => {
    newStr = newStr.replace(square, '');
  }) 
  return newStr;
}
export default defineComponent({
  components: {OptionTab},
  setup() {
    const isInit = ref(true);
    const showAlias = ref(false);

    const loading = ref(false);
    const showLoading = ref(false);
    const loadingTimeout = ref(0);

    // 控制table 缩放
    const zoomSize = ref(100);

    const logStoreIns = logDataStore();
    const filterStoreIns = filterStore();
    
    // 重置筛选项
    filterStoreIns.$reset();
    const selectedThreads = reactive([]);
    
    let panelsArray = ref<any>([]);
    let timeStampArray = ref<string[]>([]);
    let allThreadIDArray = ref<string[]>([]);
    let drawData = ref<any>({});

    return {
      isInit,
      showAlias,
      loading,
      showLoading,
      loadingTimeout,
      zoomSize,
      logStoreIns,
      panelsArray,
      timeStampArray,
      allThreadIDArray,
      drawData,
      selectedThreads
    }
  },
  mounted () {
    this.updateView();
  },
  computed: {
    ...mapState(filterStore, {
      threadIDs: "threadIDs",

      fileNameSwitch: "fileNameSwitch",
      methodNameSwitch: "methodNameSwitch",
      mainTextSwitch: "mainTextSwitch"
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
    dropCount () {
      ElNotification({
        title: "日志更新",
        type: 'success',
        'show-close': false
      })
      this.isInit = true;
      this.selectedThreads = [];
      this.updateView();
    },
    loading (curVal, preVal) {
      this.loadingTimeout = clearTimeout(this.loadingTimeout);
      this.loadingTimeout = setTimeout(() => {
        this.showLoading = true;
        setTimeout(() => {
          this.showLoading = false;
        }, 1000);
      }, 10)
    }
  },
  methods: {
    changeThreads () {
      this.loading = true;
      this.generateGridData(this.convertToClass(this.getLogData));
      this.loading = false;
    },
    // 转换为实体类
    convertToClass (rawArr) {
      if (!rawArr) {
        throw new Error("convertToClass input invalid");
      }
      // list 提取 时间戳 去重
      let arr = [];
      let dataArr = getValFromProxy(rawArr);

      console.log("convertToClass", dataArr.length)

      // 初始化线程名集合
      let threadSet = new Set();
      let timestampSet = new Set();
      for (let i = 0; i < dataArr.length; i++) {
        let str = dataArr[i];
        // 初始化正文
        let mainText = '';
        // 按分割符，切分tag区域和正文区域, 
        if (str.indexOf(MAIN_TEXT_SPLIT_KEY) > -1) {
          let strSplitArr = str.split(MAIN_TEXT_SPLIT_KEY);
          str = strSplitArr[0];
          mainText = strSplitArr[1].trim();
        } 
        // 如果没有，则认为是非业务日志，去掉方括号的部分视为正文
        else {
          mainText = removeRecognizedTag(str).trim();
          // TODO 呈现第三方tag
          // let unrecognizedTags = matchDefault(str, reg.regSplitTag);
          // console.log("unrecognizedTags", unrecognizedTags);
        }
        let timestamp = matchDefault(str, reg.regTimeTag);
        let level = matchDefault(str, reg.regLevelTag);
        let methodName = matchDefault(str, reg.regMethodTag);
        let fileTag = str.match(reg.regFileTag) ? str.match(reg.regFileTag) : "";
        let fileName = "";
        let lineNum = 0;
        if (timestamp) {
          timestampSet.add(timestamp);
        }
        if (fileTag.length >= 4) {
          // 有效的文件：行号tag
          fileName = fileTag[2];
          lineNum = fileTag[3];
        }
        let threadID = matchDefault(str, reg.regThreadTag);
        if (threadID) {
          threadSet.add(threadID);
        }
        
        const args =[timestamp, level, threadID, fileName, lineNum, methodName, mainText];
        let item = new logDataItem(i, str, ...args);
        if (item.timestamp.length < 1) {
          break;
        }
        arr.push(item);
      }
      // 排序
      let sorted = Array.from(threadSet).sort((a:number, b: number) => a - b);
      sorted.push('other')
      console.log("allThreadIDArray sorted", sorted);
      this.allThreadIDArray = sorted;
      // 初始化，线程全选
      if (this.isInit) {
        this.isInit = false;
        this.selectedThreads = Array.from(sorted.slice(0, 5));
      }
      this.timeStampArray = Array.from(timestampSet);
      return arr;
    },
    generateGridData (instanceArr:logDataItem[]) {
      // 时间轴（纵轴）
      if (this.timeStampArray.length < 0 ) {
        return;
      }
      // 预先生成好容器
      let rowTemplate = {
      }
      // 根据有效线程数 (横轴)，动态分配
      this.selectedThreads.forEach((e) => {
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
        if (curObj[threadID]) {
          curObj[threadID].push(ins);
        }
      })
      // 线程筛选后，如果一行数据没有任何数据，该行不展示
      let output = {};
      let filterTimestamp = [];
      Object.keys(rowMap).forEach((k) => {
        let values = Object.values(rowMap[k]).flat();
        if (values.length > 0) {
          output[k] = rowMap[k];
          filterTimestamp.push(k);
        }
      });
      // 保存最终输出的数据
      this.drawData = output;
      this.timeStampArray = filterTimestamp;
      return output;
    },
    updateView () {
      this.timeStampArray = [];
      this.allThreadIDArray.value = [];
      this.generateGridData(this.convertToClass(this.getLogData));
    }
  }
})

</script>
<template>
  <div class="thread-view">
    <div class="thread-view-filter__grid">
      <div class="thread-view__tag grid-item">
        <p>Tags:</p>
        <div class="tag-tabs">
          <option-tab :tabKey="`fileName`" :text="`文件名`" :colorType="`warning`"></option-tab>
          <option-tab :tabKey="`methodName`" :text="`方法名`" :colorType="`success`"></option-tab>
          <option-tab :tabKey="`mainText`" :text="`正文`" :colorType="`main`"></option-tab>
        </div>
      </div>
      <div class="thread-alias grid-item">
        <p>Alias:</p>
        <el-switch
          v-model="showAlias"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #CCCCCC"
        />
      </div>
      <div class="zoom-bar grid-item">
        <p>Zoom:</p>
          <el-slider v-model="zoomSize" :min="20"/>
      </div>
      <div class="show-threads grid-item">
        <p>Threads:</p>
        <el-select
          @change="changeThreads"
          v-model="selectedThreads"
          multiple
          placeholder="Select"
          style="width: 100%"
        >
          <el-option
            v-for="thread in allThreadIDArray"
            :key="thread"
            :label="thread"
            :value="thread"
          />
        </el-select>
      </div>
    </div>
    
    <div class="thread-view__header"  :style="`zoom: ${zoomSize/100}`">
      <div class="timestamp-left header-timestamp">时间戳</div>
      <div class="header-title header-thread" v-for="(thread, t) in selectedThreads" :key="t">
        线程：{{thread}}
        <input class="header-thread-alias" v-show="showAlias" placeholder="输入别名"/>
        <!-- <div class="alias-editable" v-show="showAlias" contenteditable="true" aria-placeholder="输入别名"></div> -->
      </div>
    </div>
    <div class="thread-view__panel" v-loading="showLoading"  :style="`zoom: ${zoomSize/100}`">
      <div class="row" v-for="(timestamp, i) in timeStampArray" :key="i">
        <div class="timestamp-left">{{timestamp}}</div>
        <div class="lines-right column" v-for="(lines, j) in drawData[timestamp]" :key="j">
          <div :class="['column-text__line', line.level]" v-for="(line, k) in lines" :key="k">
            <div class="item-params file-name" v-if="fileNameSwitch && line.fileName">{{`${line.fileName}:${line.lineNumber}`}}</div>
            <div class="item-params method-name" v-if="methodNameSwitch && line.methodName">{{`${line.methodName}`}}</div>
            <div class="item-params main-text" v-if="mainTextSwitch && line.text">{{line.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="thread-view__footer"></div>
  </div>
</template>

<style scoped lang="scss">
@import "src/assets/colors.scss";
$header-height: 40px;
.I {
  background: $bg;
}
.W {
  background: $warning-disabled;
}
.E {
  background: $error-disabled;
  color: $bg;
}
.thread-view{
  height: 100%;
  width: 100%;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  flex: 1;
  .thread-view-filter__grid {
    display: grid;
    grid-template-columns: 320px 80px 150px 1fr;
    grid-template-rows: repeat(1, 60px);
    grid-gap: 20px;
    .grid-item {
      display: flex;
      justify-content: center;
      align-items: center;
      > p {
        margin-right: 10px;
      }
    }
    .thread-view__tag {
      .tag-tabs {
        flex: 1;
        display: flex;
        justify-content: space-evenly;
      }
    }
  }
  .show-threads {
    width: 100%;
    > p {
      width: 80px;
    }
    .thread {
      margin-left: 20px;
    }
  }
  .thread-view__header,
  .thread-view__footer {
    text-align: center;
  }
  .thread-view__header {
    display: flex;
    .timestamp-left {
      line-height: $header-height;
    }
    .header-timestamp {
      border: 1px solid $line;
      border-bottom: none;
      border-right: none;
    }
    .header-thread {
      flex:1;
      height: $header-height; 
      line-height: $header-height;
      border-top: 1px solid $line;
      border-right: 1px solid $line;
      color: $text-sub;
      display: flex;
      align-items: center;
      justify-content: center;
      &:last-child {
        padding-right: 10px;
      }
      .header-thread-alias {
        height: 30px;
        line-height: 30px;
        border: 1px solid $line;
        border-radius: 5px;
        margin: 0 10px;
        text-align: center;
      }
      .alias-editable {
        height: 30px;
        line-height: 30px;
        border: 1px solid $line;
        border-radius: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 10px;
        flex: 1;
      }
    }
  }
  .thread-view__footer {
    clear: both;
  }

  .timestamp-left {
    width: 120px;
    overflow: hidden auto;
    border-color: $line;
    display: flex;
    justify-content: center;
  }
  .thread-view__panel {
    overflow: hidden auto;
    flex-direction: column;
    margin: 0 0 30px 0;
    .row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      border: 1px solid $line;
      .timestamp-left {
      }
      .lines-right {
        width: 0;
        flex: 1;
        justify-content: center;
        overflow: auto hidden;
      }
    }
    .column-text__line {
      padding: 0 10px;
      margin-bottom: 1px;
      display: flex;
      flex-flow: row wrap;
      .item-params {
        padding: 0 5px;
        border-radius: 5px;
        margin: 3px;
        line-height: 30px;
        &.file-name {
          background-color: $warning;
          color: $bg;
          height: 30px;
          line-height: 30px;
        }
        &.method-name {
          background-color: $success;
          color: $bg;
        }
        &.main-text {
          background-color: $main;
          color: $bg;
        }

      }
    }
    .thread-view__item {
      max-width: 500px;
    }
  }
    
    
}
</style>