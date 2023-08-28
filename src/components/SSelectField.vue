<template>
    <div class="w-flex column gap2">
        <div class="title3">{{title}}</div>
        <div class="bd1 bdrs1 pa2">
          <w-select :items="items" v-model="selectionCurrent" @item-select="$emit('item-select', selectionCurrent)"/>
        </div>
    </div>
</template>

<script>
export default {
  name: "SSelectField",
  props: {
    title: String,
    items: Array,
    selection: Number
  },
  data() {
    return {
      selectionCurrent: {label: 'Создана', value: 1} //this.selection
    }
  },
}
</script>

<style scoped>

</style>