<template>
  <w-toolbar bg-color="base-bg-color" vertical class="pa0">
    <s-aside-button router-link="/tickets"> Заявки </s-aside-button>
    <s-aside-button
      v-if="userStore.user.role.id === 2 || userStore.user.role.id === 3"
      router-link="/users"
    >
      Пользователи
    </s-aside-button>
    <s-aside-button
      v-if="userStore.user.role.id === 2 || userStore.user.role.id === 3"
      router-link="/computers"
    >
      Компьютеры
    </s-aside-button>
    <s-aside-button
      v-if="userStore.user.role.id === 2 || userStore.user.role.id === 3"
      router-link="/knowledge"
    >
      База знаний
    </s-aside-button>
    <s-aside-button v-if="userStore.user.role.id === 3" router-link="/reports">
      Отчеты
    </s-aside-button>
    <s-aside-button v-if="userStore.user.role.id === 3" router-link="/settings">
      Настройки
    </s-aside-button>

    <div class="spacer" />
    <w-divider />

    <s-aside-button router-link="/news"> Новости </s-aside-button>

    <s-aside-button router-link="/contacts"> Контакты </s-aside-button>
  </w-toolbar>
</template>

<script>
import SAsideButton from '@/components/UI/SAsideButton.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

export default {
  name: 'SAside',
  computed: {
    ...mapStores(useUserStore),
  },
  components: { SAsideButton },
}
</script>

<style scoped></style>
