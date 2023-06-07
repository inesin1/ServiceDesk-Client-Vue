<template>
  <w-toolbar bg-color="grey-dark6" vertical class="pa0">
    <s-aside-button
        router-link="/tickets"
        v-if="userRole == 1 || userRole == 2 || userRole == 3">
      Заявки
    </s-aside-button>
    <s-aside-button
        router-link="/users"
        v-if="userRole == 2 || userRole == 3">
      Пользователи
    </s-aside-button>
    <s-aside-button
        router-link="/vnc"
        v-if="userRole == 2 || userRole == 3">
      VNC
    </s-aside-button>
    <s-aside-button
        router-link="/knowledge"
        v-if="userRole == 2 || userRole == 3">
      База знаний
    </s-aside-button>
    <s-aside-button
        router-link="/reports"
        v-if="userRole == 3">
      Отчеты
    </s-aside-button>
    <s-aside-button
        router-link="/settings"
        v-if="userRole == 3">
      Настройки
    </s-aside-button>

    <div class="spacer"></div>
    <w-divider ></w-divider>

    <s-aside-button>Контакты</s-aside-button>
  </w-toolbar>
</template>

<script>
import SAsideButton from "@/components/UI/SAsideButton.vue";
import store from "@/store";

export default {
  name: "SAside",
  computed: {
    userRole() {
      return store.getters.getUserRole;
    }
  },
  components: {SAsideButton},
}
</script>

<style scoped>

</style>