<script lang="ts">

</script>

<template>
  <div class="thread-filter">
    <span class="keyword-filter__span">筛选：</span>
    <el-input class="w-50 m-2" v-model="input" placeholder="Please input" @change="inputFilter" @input="inputFilter"/>
  </div>
</template>
