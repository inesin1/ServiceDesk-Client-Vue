<template>
    <w-toolbar bg-color="grey-dark6" vertical class="pa0">
        <s-aside-button router-link="/tickets">Заявки</s-aside-button>
        <w-button text lg class="px10 py6" width="100%" @click="$router.push('/reports')">Отчёты</w-button>
        <w-button text lg class="px10 py6" width="100%" @click="$router.push('/reports')">Настройки</w-button>
        <w-button text lg class="px10 py6" width="100%">VNC</w-button>
        <div class="spacer"></div>
        <w-divider ></w-divider>
        <w-button text lg class="px10 py6" width="100%">Контакты</w-button>
    </w-toolbar>
</template>

<script>
export default {
    name: "SAside"
}
</script>

<style scoped>

</style>