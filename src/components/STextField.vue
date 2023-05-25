<template>
    <div class="w-flex column gap2">
        <div class="title3">{{title}}</div>
        <div
            v-if="link !== undefined"
            class="bd1 bdrs1 pa2 link"
            @click="$router.push(link)"
        >
            {{body}}
        </div>
        <div v-else class="bd1 bdrs1 pa2">{{body}}</div>
    </div>
</template>

<script>
export default {
  name: "STextField",
  props: {
    title: String,
    body: String,
    link: Object,
  },
}
</script>

<style scoped>
    .link {
        cursor: pointer;
    }
    .link:hover {
        background: #353535;
    }
</style>