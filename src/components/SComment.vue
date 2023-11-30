<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";

export default defineComponent({
  name: "SComment",
  props: {
    creatorId: Number,
    username: String,
    text: String,
    date: String
  },
  data: () => ({
    name: null
  }),
  created() {
    if (this.creatorId !== undefined)
      httpCommon.getUser(this.creatorId)
          .then(user => this.name = user.name)
  }
})
</script>

<template>
  <w-flex column class="gap2">
    <w-flex gap="2">
      <div class="title5">{{ username !== undefined ? username : name }}</div>
      <div class="caption align-self-end">{{ date }}</div>
    </w-flex>
    <div class="body">{{ text }}</div>
  </w-flex>
</template>

<style scoped>

</style>