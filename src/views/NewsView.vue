<script>
import {defineComponent} from 'vue'
import SNewsItem from "@/components/SNewsItem.vue";

export default defineComponent({
  name: "NewsView",
  components: {SNewsItem}
})
</script>

<template>
  <w-card
      title="Новости"
      class="ma4"
      bg-color="base-bg-color"
  >
    <s-news-item title="Изменения в новой версии 1.2" date="28.08.2023">
      <li>Добавлена прокрутка заявок</li>
      <li>Сортировка по умолчанию теперь по статусу заявки, закрытые в конце</li>
      <li>Добавлена возможность внести Telegram ChatId в свой профиль (Только для ИТ-специалистов)</li>
      <li>Добавлена возможность получать уведомления о новых заявках в Telegram (Только для ИТ-специалистов)</li>
      <li>Исправлены мелкие ошибки</li>
    </s-news-item>
  </w-card>
</template>

<style scoped>

</style>