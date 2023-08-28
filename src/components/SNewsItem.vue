<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "SNewsItem",
  props: {
    title: String,
    date: String
  }
})
</script>

<template>
  <w-flex column>
    <div class="caption">{{ date }}</div>
    <div class="title2 mb2">{{ title }}</div>
    <div class="body"><slot></slot></div>
  </w-flex>
</template>

<style scoped>

</style>