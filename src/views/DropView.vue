<script setup lang="ts">
import { onMounted, ref, nextTick} from "vue";
import { useRouter } from "vue-router";
import { logDataStore } from "../stores/mainStore";
const logStore = logDataStore();
let fileSelected = ref(false);
// 
let dropActive = ref(false);
let dropzone = ref<any>(null);
const router = useRouter();
onMounted(() => {
  
})
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
      router.push({ path: "log"})
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
      router.push({ path: "log"})
    })
  };
}

const splitFileByLine = (data:string): string[] => {
  const result:string[] = data.split("\n");
  console.log("splitFile complete, lines:", result.length);
  return result;
}
</script>

<template>
  <div class="dropzone__wrapper" v-if="!fileSelected">
    
    <div :class="[{active: dropActive}, 'dropzone']" ref="dropzone"
      @drop="fileDropped"
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      @dragover="dragOver">
      <p class="drop-file-here" >拖拽日志文件到此处, 或者</p>
      <input type="file" ref="fileBtn" accept=".log" class="fileBtn" @change="getLog"/>
    </div>
  </div>
  <div class="data-view" v-else></div>
</template>

<style scoped>
.dropzone__wrapper {
  width: 100vw;
  height: 100vh;
  padding: 20px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropzone {
  width: 80%;
  height: 80%;
  border-radius: 20px;
  border: 3px dashed black;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dropzone > p.drop-file-here {
  font-size: 30px;
}
.dropzone.active {
  background-color: rgba(0, 0, 0, 0.2)
}
</style>

