<template>
    <w-button text lg class="px10 py6" width="100%" @click="$router.push(routerLink)"><slot/></w-button>
</template>

<script>
export default {
    name: "SAsideButton",
    props: ['routerLink']
}
</script>

<style scoped>

</style>