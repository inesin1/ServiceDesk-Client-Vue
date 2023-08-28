<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "SContactItem",
  props: {
    job: String,
    name: String,
    contacts: String
  }
})
</script>

<template>
  <w-flex gap="4" >
    <div class="title5">{{job}}</div>
    <div class="body">{{name}}</div>
    <div class="body">{{contacts}}</div>
  </w-flex>
</template>

<style scoped>

</style>