<template>
  <w-toolbar bg-color="base-bg-color" vertical class="pa0">
    <s-aside-button
        router-link="/tickets">
      Заявки
    </s-aside-button>
    <s-aside-button
        router-link="/users"
        v-if="userStore.user.role.id === 2 || userStore.user.role.id === 3">
      Пользователи
    </s-aside-button>
    <s-aside-button
        router-link="/computers"
        v-if="userStore.user.role.id === 2 || userStore.user.role.id === 3">
      Компьютеры
    </s-aside-button>
    <s-aside-button
        router-link="/knowledge"
        v-if="userStore.user.role.id === 2 || userStore.user.role.id === 3">
      База знаний
    </s-aside-button>
    <s-aside-button
        router-link="/reports"
        v-if="userStore.user.role.id === 3">
      Отчеты
    </s-aside-button>
    <s-aside-button
        router-link="/settings"
        v-if="userStore.user.role.id === 3">
      Настройки
    </s-aside-button>

    <div class="spacer"></div>
    <w-divider ></w-divider>

    <s-aside-button
        router-link="/news">
      Новости
    </s-aside-button>

    <s-aside-button
      router-link="/contacts"
    >
      Контакты
    </s-aside-button>
  </w-toolbar>
</template>

<script>
import SAsideButton from "@/components/UI/SAsideButton.vue";
import { useUserStore } from "@/stores/user";
import {mapStores} from "pinia";

export default {
  name: "SAside",
  computed: {
    ...mapStores(useUserStore)
  },
  components: {SAsideButton},
}
</script>

<style scoped>

</style>