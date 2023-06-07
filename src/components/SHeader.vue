<template>
    <header>
        <w-toolbar shadow class="py2">
            <w-icon color="light-blue-dark3 mr3" size="3em">mdi mdi-help-box-multiple-outline</w-icon>
            <div class="headline">Сервис Деск</div>
            <div class="spacer"></div>
            <w-menu
                    shadow
                    v-if="$store.getters.isAuthenticated">
                <template
                        #activator="{ on }">
                    <w-button
                            v-on="on"
                            text>
                        {{$store.state.user.name}}
                    </w-button>
                </template>
                <w-button text @click="$router.push('/profile/' + $store.getters.getCurrentUser.id)" >Профиль</w-button>
                <w-button text @click="$store.commit('logout')">Выход</w-button>
            </w-menu>
        </w-toolbar>
    </header>
</template>

<script>
export default {
  name: "s-header",
}
</script>

<style scoped>

</style>