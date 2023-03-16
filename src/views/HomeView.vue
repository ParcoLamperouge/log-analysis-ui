<script lang="ts">
import { ref, nextTick} from "vue";
import { logDataStore } from "../stores/mainStore";
import AnalyzePage from './analyzePage/Analyze.vue';
export default {
  components: { AnalyzePage },
  setup() {
    const logStore = logDataStore();
    let fileSelected = ref(false);
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
          fileSelected.value = true;
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
          fileSelected.value = true;
        })
      };
    }

    const splitFileByLine = (data:string): string[] => {
      const result:string[] = data.split("\n");
      return result;
    }

    return {fileSelected, dropActive,
    fileDropped, dragEnter, dragLeave, dragOver,
    getLog, splitFileByLine}
  }
}

</script>

<template>
  <div class="home-view__wrapper">
    <template v-if="!fileSelected">  
      <div :class="[{active: dropActive}, 'dropzone']" ref="dropzone"
        @drop="fileDropped"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @dragover="dragOver">
        <p class="drop-file-here" >拖拽日志文件到此处, 或者点击</p>
        <input type="file" ref="fileBtn" accept=".log" class="file-btn" @change="getLog"/>
      </div>
    </template>
    <template v-if="fileSelected">
      <AnalyzePage></AnalyzePage>
    </template>
  </div>
</template>

<style scoped lang="scss">
@import "src/assets/colors.scss";
.home-view__wrapper {
  background: $bg !important;
  color: #000000 !important;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropzone {
  border-radius: 20px;
  border: 3px dashed black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20%;
  .file-btn {
    margin-left: 10px;
  }
  > p.drop-file-here {
    font-size: 30px;
  }
  &.active {
    background-color: rgba(0, 0, 0, 0.2)
  }
}
</style>

