<script lang="ts">
import { ref, nextTick} from "vue";
import { logDataStore } from "../stores/mainStore";
export default {
  props: {
    size: String
  },
  setup() {
    const logStore = logDataStore();
    let dropActive = ref(false);
    const fileDropped = (e:any) => {
      e.stopPropagation();
      e.preventDefault();
      dropActive.value = false;
      let fileData = e;
      console.log("fileDropped", fileData);
      let fileSelect = e.dataTransfer.files[0];
      let reader = new FileReader();
      reader.readAsText(fileSelect, "utf-8");
      reader.onload = () => {
        nextTick(() => {
          let str = reader.result || '';
          logStore.setLogData(fileSelect.name, splitFileByLine(str.toString()));
        })
      };
    }
    const dragEnter = (e:any) => {
      e.stopPropagation();
      e.preventDefault();
      dropActive.value = true;
    }

    const dragLeave = (e:any) => {
      e.stopPropagation();
      e.preventDefault();
      dropActive.value = false;
    }
    const dragOver = (e:any) => {
      e.stopPropagation();
      e.preventDefault();
      dropActive.value = true;
    }
    const getLog = (e:any) => {
      if (typeof FileReader === 'undefined') {
        new Error("浏览器不支持，赶紧换Chrome吧球球了");
        return;
      }
      let fileSelect = e.target.files[0];
      let reader = new FileReader();
      reader.readAsText(fileSelect, "utf-8");
      reader.onload = () => {
        nextTick(() => {
          let str = reader.result || '';
          logStore.setLogData(fileSelect.name, splitFileByLine(str.toString()));
        })
      };
    }

    const splitFileByLine = (data:string): string[] => {
      const result:string[] = data.split("\n");
      return result;
    }

    return {dropActive,
    fileDropped, dragEnter, dragLeave, dragOver,
    getLog, splitFileByLine}
  }
}
</script>

<template>
  <div :class="['dropzone__wrapper', size]">
    <div :class="[{active: dropActive}, 'dropzone']" ref="dropzone"
      @drop="fileDropped"
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      @dragover="dragOver">
      <p class="drop-file-here" >拖拽日志文件到此处, 或者点击</p>
      <input type="file" ref="fileBtn" accept=".log" class="file-btn" @change="getLog"/>
    </div> 
  </div>
</template>

<style scoped lang="scss">
.dropzone__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .dropzone {
    display: flex;
    justify-content: center;
    align-items: center;
    .file-btn {
      margin-left: 10px;
    }
    &.active {
      background-color: rgba(0, 0, 0, 0.2)
    }
  }
  &.large {
    .dropzone {
      border-radius: 20px;
      border: 3px dashed black;
    }
    .dropzone > p.drop-file-here {
      font-size: 30px;
    }
  }
  &.small {
    .dropzone {
      height: 60px;
      border-radius: 8px;
      padding: 5px;
      border: 1px dashed black;
    }
    .dropzone > p.drop-file-here {
      font-size: 14px;
    }
  }
}
</style>

