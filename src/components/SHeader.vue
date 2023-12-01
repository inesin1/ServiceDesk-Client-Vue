<template>
    <header>
        <w-toolbar shadow class="py2">
            <w-icon color="light-blue-dark3 mr3" size="3em">mdi mdi-help-box-multiple-outline</w-icon>
            <div class="headline">Сервис Деск</div>
            <div class="caption align-self-center ml2">2.0.0</div>
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
                    v-if="userStore.isAuthenticated">
                <template
                        #activator="{ on }">
                    <w-button
                            v-on="on"
                            text>
                        {{userStore.user.name}}
                    </w-button>
                </template>
                <w-button text @click="$router.push('/profile/' + userStore.user.id)" >Профиль</w-button>
                <w-button text @click="userStore.logout">Выход</w-button>
            </w-menu>
        </w-toolbar>
    </header>
</template>

<script>
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user";

export default {
  name: "s-header",
  data: function () {
    return {
      themeSwitch: {
        value: this.$waveui.theme === 'dark'
      }
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  watch: {
    "themeSwitch.value" (value) {
      if (value) {
        this.$waveui.switchTheme('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        this.$waveui.switchTheme('light')
        localStorage.setItem('theme', 'light')
      }
    }
  }
}
</script>

<style scoped>

</style>