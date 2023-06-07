<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "SComment",
  props: {
    authorId: Number
  }
})
</script>

<template>
  <w-flex class="gap2">
    <w-image :src="`${$store.getters.getBaseURL}userProfileImages/${authorId}`"/>
    
  </w-flex>
</template>

<style scoped>

</style>