<script lang="ts">
import { mapState } from 'pinia';
import { logDataStore } from "@/stores/mainStore";
import AnalyzePage from './analyzePage/AnalysisView.vue';
import DropZone from "./components/DropZone.vue"
export default {
  components: { AnalyzePage, DropZone },
  setup() {
  },
  
  computed: {
    ...mapState(logDataStore, {
      dropCount: "dropCount"
    }),
  },
  methods: {
  }
}

</script>

<template>
  <div class="home-view__wrapper">
    <template v-if="dropCount === 0">
      <drop-zone :size="'large'"></drop-zone>
    </template>
    <template v-if="dropCount > 0">
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

</style>

