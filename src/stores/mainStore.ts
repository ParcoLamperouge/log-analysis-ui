import { defineStore } from 'pinia'
import { logFile } from '../class/logFile'

export const useStore = defineStore("main", {});

const initData:logFile = new logFile();
export const logDataStore = defineStore("log", {
  state: () => {
    return {
      logFile: initData
    }
  },
  getters: {
    getLogData: (state) => {
      state.logFile;
    }
  },
  actions: {
    setLogData(fileName:string, data:string[]) {
      this.logFile.fileName = fileName;
      this.logFile.data = data
    }
  }
})

export const filterStore = defineStore("filter", {
  state: () => {
    return {
      customKeyword: "",
      threadIDs: Array(5)
    }
  },
  getters: {
    getCustomKeyWord: (state) => {
      state.customKeyword
    }
  },
  actions: {
    setThreadID(threadNum:number, threadId:string) {
      if (threadNum < 0 || threadNum > 4) {
        return;
      }
      this.threadIDs[threadNum] = threadId;
    },
    emptyThreadIDs() {
      this.threadIDs = new Array(5);
    }
  }
})

export const viewStore = defineStore("view", {
  state: () => {
    return {
      viewType: "text"
    }
  },
})