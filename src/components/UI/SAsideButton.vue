<template>
    <w-button v-if="!active" text lg class="px10 py6" width="100%" @click="$router.push(routerLink)"><slot/></w-button>
    <w-button v-else text lg class="px10 py6" width="100%" @click="$router.push(routerLink)"><slot/></w-button>
</template>

<script>
export default {
    name: "SAsideButton",
    props: {
      routerLink: String,
      active: Boolean
    }
}
</script>

<style scoped>

</style>