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
      customKeyWord: ""
    }
  },
  getters: {
    getCustomKeyWord: (state) => {
      state.customKeyWord
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