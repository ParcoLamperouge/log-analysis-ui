<script lang="ts">
import { ref, defineComponent} from "vue";
import { ElNotification } from 'element-plus';
import { logDataStore, filterStore }from "../../stores/mainStore";
import { mapState } from 'pinia';
import { generateGridData, extractData } from './stringHandle';
import { getValFromProxy } from "../../utils/tools"
import OptionTab from '../../components/OptionTab.vue'

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

    const insLogStore = logDataStore();
    const insFilterStore = filterStore();
    
    // 重置筛选项
    insFilterStore.$reset();
    const selectedThreads = ref<any[]>([]);
    
    let panelsArray = ref<any>([]);
    let timeStampArray = ref<any[]>([]);
    let allThreadIDArray = ref<string[]>([]);
    let drawData = ref<any>({});

    return {
      isInit,
      showAlias,
      loading,
      showLoading,
      loadingTimeout,
      zoomSize,
      insLogStore,
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
    })
  },
  watch: {
    dropCount () {
      const option:any = {
        title: "日志更新",
        type: 'success',
        'show-close': false
      }
      ElNotification(option);
      this.isInit = true;
      this.selectedThreads = [];
      this.updateView();
    },
    // loading (curVal, preVal) {
    //   this.loadingTimeout = clearTimeout(this.loadingTimeout);
    //   this.loadingTimeout = setTimeout(() => {
    //     this.showLoading = true;
    //     setTimeout(() => {
    //       this.showLoading = false;
    //     }, 1000);
    //   }, 10)
    // }
  },
  methods: {
    changeThreads () {
      this.loading = true;
      let {
        output, timeStampArray
      } = generateGridData(
        this.convertToClass(this.insLogStore.getLogData),
        this.timeStampArray, 
        this.selectedThreads
      );
      this.drawData = output;
      this.timeStampArray = timeStampArray;
      this.loading = false;
    },
    // 转换为实体类
    convertToClass (rawArr:any) {
      if (!rawArr) {
        throw new Error("convertToClass input invalid");
      }
      // list 提取 时间戳 去重
      let dataArr = getValFromProxy(rawArr);
      let { arr, sorted, timestampSet } = extractData(dataArr);
      this.allThreadIDArray = sorted;
      // 初始化，线程全选
      if (this.isInit) {
        this.isInit = false;
        this.selectedThreads = Array.from(sorted.slice(0, 5));
      }
      this.timeStampArray = Array.from(timestampSet);
      return arr;
    },
    emptyCurrent() {
      this.timeStampArray = [];
      this.allThreadIDArray = [];
    },
    updateView () {
      this.emptyCurrent();
      this.changeThreads();
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