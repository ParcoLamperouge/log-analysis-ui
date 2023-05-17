<script lang="ts">
import { nextTick} from "vue";
import { logDataStore } from "@/stores/mainStore";
import { ElNotification } from 'element-plus';
// import { logFileUpload } from '../../api/httpInterface.js';
export default {
  props: {
    size: String
  },
  setup() {
    if (typeof FileReader === 'undefined') {
      const errorOption:any = {
        title: `你的浏览器不支持，我推荐你用Chrome`,
        type: 'error',
        "show-close": false
      }
      ElNotification(errorOption);
      return;
    }
    const insLogStore = logDataStore();
    return {insLogStore}
  },
  data () {
    return {
      dropActive: false
    }
  },
  mounted () {

  },
  methods: {
    fileSelected (e:any) {
      let file = e.target.files[0];
      this.fileHandle(file);
    },
    fileDropped (e:any) {
      e.stopPropagation();
      e.preventDefault();
      this.dropActive = false;
      let file = e.dataTransfer.files[0];
      this.fileHandle(file);
    },
    dragEnter (e:any) {
      e.stopPropagation();
      e.preventDefault();
      this.dropActive = true;
    },
 
    dragLeave (e:any) {
      e.stopPropagation();
      e.preventDefault();
      this.dropActive = false;
    },
    dragOver (e:any) {
      e.stopPropagation();
      e.preventDefault();
      this.dropActive = true;
    },

    splitFileByLine (data:string): string[] {
      const result:string[] = data.split("\n");
      return result;
    },
    
    testFileApis (file:File) {
      // test
      this.submitFile(file);
      // split file by Blob 
      let _sliceBlob = new Blob([file]).slice(0, 5000);
      let _sliceFile = new File([_sliceBlob], "test.log");
      let fr = new FileReader();
      fr.readAsDataURL(_sliceFile);
      fr.onload = function () {
        console.log(fr.result);
      };
    },
    submitFile (fileObj:File) {
      let _formData:FormData = new FormData();
      _formData.append("file_name", fileObj.name);
      _formData.append("file", fileObj);
      // logFileUpload(_formData);
    },
    // upload fromData to server
    fileHandle (fileSelect:File) { 
      const fileName:string = fileSelect.name;
      const fileType:string = fileSelect.type;
      // 仅支持log文件或者文本格式
      const isTextFile:Boolean = fileName.endsWith(".log") || /^text\//.test(fileType);
      if (!isTextFile) {
        const option:any = {
          title: `文件"${fileSelect.name}"类型错误，请重新选择`,
          type: 'warning',
          'show-close': false
        }
        ElNotification(option);
        return;
      }
      let reader = new FileReader();
      reader.readAsText(fileSelect, "utf-8");
      const self = this;
      reader.onload = () => {
        nextTick(() => {
          let str = reader.result || '';
          self.insLogStore.setLogData(fileSelect.name, self.splitFileByLine(str.toString()));
        })
      };
      // testFileApis(fileSelect);
    }
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
      <input type="file" ref="fileBtn" accept=".log" class="file-btn" @change="fileSelected"/>
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

