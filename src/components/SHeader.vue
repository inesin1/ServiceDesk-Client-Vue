<template>
    <header>
        <w-toolbar shadow class="py2">
            <w-icon color="light-blue-dark3 mr3" size="3em">mdi mdi-help-box-multiple-outline</w-icon>
            <div class="headline">Сервис Деск</div>
            <div class="caption align-self-center ml2">v1.3.1</div>
            <div class="spacer"></div>

          <w-switch v-model="themeSwitch.value" class="ma4">
            <template #thumb>
              <w-icon>
                {{ themeSwitch.value ? 'mdi mdi-weather-night' : 'mdi mdi-white-balance-sunny' }}
              </w-icon>
            </template>
          </w-switch>

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
import {watch} from "vue";

export default {
  name: "s-header",
  data: function () {
    return {
      themeSwitch: {
        value: this.$waveui.theme === 'dark'
      }
    }
  },
  watch: {
    "themeSwitch.value" (value) {
      if (value) {
        this.$waveui.switchTheme('dark')
      } else
        this.$waveui.switchTheme('light')
    }
  }
}
</script>

<style scoped>

</style>