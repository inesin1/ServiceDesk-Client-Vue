<script>
import {defineComponent} from 'vue'
import SContactItem from "@/components/SContactItem.vue";

export default defineComponent({
  name: "ContactsView",
  components: {SContactItem}
})
</script>

<template>
  <w-card
      title="Контакты"
      class="ma4"
      bg-color="base-bg-color"
  >

    <w-flex column gap="4">

      <div class="title3">Подразделение 1</div>
      <div class="body">Адрес: 40 лет победы, д. 7</div>

      <w-divider/>

      <SContactItem
        job="Старший программист"
        name="Ельчанинова Татьяна Владимировна"
        contacts="+7 (963) 465-19-72"
      />

      <w-divider/>

      <SContactItem
          job="Программист"
          name="Несин Артём Игоревич"
          contacts="+7 (908) 047-42-15"
      />

      <w-divider/>

      <SContactItem
          job="Программист (МИС Барс)"
          name="Гатауллин Вадим Вячеславович"
          contacts="+7 (999) 587-72-21"
      />

      <w-divider/>

      <SContactItem
          job="Системный администратор"
          name="Кишкопаров Игорь Станиславович"
          contacts="+7 (904) 941-55-03"
      />

      <div class="title3 mt8">Подразделение 2</div>
      <div class="body">Адрес: Космонавтов, д. 5</div>

      <w-divider/>

      <SContactItem
          job="Системный администратор"
          name="Черемушкин Эдуард Геннадьевич"
          contacts="+7 (900) 023-38-68"
      />

      <div class="title3 mt8">Подразделение 3</div>
      <div class="body">Адрес: Бушуева, д. 16</div>

      <w-divider/>

      <SContactItem
          job="Программист"
          name="Тетюшкин Матвей Сергеевич"
          contacts="+7 (951) 479-69-01"
      />

      <div class="title3 mt8">Подразделение 4</div>
      <div class="body">Адрес: Мельнова, д. 7а</div>

      <w-divider/>

      <SContactItem
          job="Программист"
          name="Асаев Эльдар Римонович"
          contacts="+7 (999) 588-77-05"
      />

      <div class="title3 mt8">Подразделение 5</div>
      <div class="body">Адрес: Северо-Запад, 2-й квартал, д. 5</div>

      <w-divider/>

      <SContactItem
          job="Программист"
          name="Баранов Михаил Евгеньевич"
          contacts="+7 (908) 061-73-94"
      />

    </w-flex>

  </w-card>
</template>

<style scoped>

</style>