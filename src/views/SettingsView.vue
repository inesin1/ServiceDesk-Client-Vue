<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";

export default defineComponent({
  name: "SettingsView",
  data: () => ({
    menuTree: [
      {
        label: 'Справочники',
        children: [
          { label: 'Статусы' },
          { label: 'Роли' },
          { label: 'Категории проблем' },
        ]
      },
      {
        label: 'Структура ЛПУ',
        children: [
          { label: 'Подразделения' },
          { label: 'Отделения' },
        ]
      }
    ],
    currentSetting: {
      label: '',
      deleteButtonDisabled: true,
      table: {
        headers: [],
        items: [],
        selection: null
      }
    }
  }),
  methods: {
    openSelectionSetting(event) {
      if (!event.item.children)
        this.loadTable(event.item.label)
    },
    tableRowSelection(event) {
      this.currentSetting.table.selection = event.item;
      this.currentSetting.deleteButtonDisabled = false;
    },
    deleteSelectedItem() {
       switch (this.currentSetting.label) {
         case 'Статусы': httpCommon.deleteStatus(this.currentSetting.table.selection.id); break;
         case 'Роли': httpCommon.deleteRole(this.currentSetting.table.selection.id); break;
         case 'Категории проблем': httpCommon.deleteProblemCategory(this.currentSetting.table.selection.id); break;
       }
    },
    loadTable(tableName) {
      this.currentSetting.label = tableName;

      this.currentSetting.table.headers = [];
      this.currentSetting.table.items = [];

      switch (tableName) {
        case 'Статусы':
          httpCommon.getStatuses().then(items => {
            // Добавляем заголовки
            Object.keys(items[0]).forEach(key => this.currentSetting.table.headers.push({ label: key, key: key }));

            // Добавляем данные
            items.forEach(item => this.currentSetting.table.items.push(item))
          });
          break;
        case 'Роли':
          httpCommon.getRoles().then(items => {
            // Добавляем заголовки
            Object.keys(items[0]).forEach(key => this.currentSetting.table.headers.push({ label: key, key: key }));

            // Добавляем данные
            items.forEach(item => this.currentSetting.table.items.push(item))
          });
          break;
        case 'Категории проблем':
          httpCommon.getProblemCategories().then(items => {
            // Добавляем заголовки
            Object.keys(items[0]).forEach(key => this.currentSetting.table.headers.push({ label: key, key: key }));

            // Добавляем данные
            items.forEach(item => this.currentSetting.table.items.push(item))
          });
          break;
      }
    }
  },
  created() {
    this.loadTable('Статусы');
  }
})
</script>

<template>
  <w-card
      title="Настройки"
      bg-color="grey-dark6"
      class="ma4"
  >

    <w-flex>
      <w-toolbar
          vertical
          class="xs2"
      >
        <w-tree
            :data="menuTree"
            selectable
            @select="openSelectionSetting($event)"
            class="fill-width"
        />
      </w-toolbar>

      <div
          class="w-flex column gap4 xs10 ma4"
      >
        <div class="title3">{{currentSetting.label}}</div>

        <div class="w-flex row gap2">
          <w-button
              bg-color="success"
          >
            Создать
          </w-button>
          <w-button
              bg-color="error"
              :disabled="currentSetting.deleteButtonDisabled"
              @click="deleteSelectedItem()"
          >
            Удалить
          </w-button>
        </div>

        <w-table
            :headers="currentSetting.table.headers"
            :items="currentSetting.table.items"
            fixed-headers
            selectable-rows="1"
            @row-select="tableRowSelection($event)"
            mobile-breakpoint="700"
        >
          <template #no-data>
            <div class="align-self-center ml2">Нет доступных записей</div>
          </template>
        </w-table>
      </div>
    </w-flex>
  </w-card>
</template>

<style scoped>

</style>