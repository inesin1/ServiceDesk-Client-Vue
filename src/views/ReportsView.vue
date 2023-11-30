<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";
import { jsontoexcel } from "vue-table-to-excel";

export default defineComponent({
  name: "ReportsView",
  data: () => ({
    loading: false,
    table: {
      headers: [
        {label: 'ID', key: 'id'},
        {label: 'Категория', key: 'category'},
        {label: 'Создатель', key: 'creator'},
        {label: 'Исполнитель', key: 'executor'},
        {label: 'Дата создания', key: 'create_date'},
        {label: 'Дата закрытия', key: 'close_date'},
        {label: 'Срок', key: 'time_limit'},
        {label: 'Статус', key: 'status'},
      ],
      items: [],
    },
    filterDialog: {
      show: false,
      fullscreen: false,
      width: 1000,
      persistent: false,
      persistentNoAnimation: false,
      form: {
        buttonLoading: false,
      }
    },

    filter: {
      category: {
        items: [],
        value: 'Все'
      },
      creator: {
        items: [],
        value: 'Все'
      },
      executor: {
        items: [],
        value: 'Все'
      },
      status: {
        items: [],
        value: 'Все'
      },
    }
  }),
  methods: {
    // Загружает заявки
    async loadTickets() {
      this.loading = true;

      this.clearTable();
      const tickets = (await httpCommon.getTickets()).reverse();
      for (const ticket of tickets) {
        this.table.items.push({
          id: ticket.id,
          category: (await httpCommon.getTicketCategory(ticket.categoryId)).name,
          creator: (await httpCommon.getUser(ticket.creatorId)).name,
          executor: ticket.executorId !== undefined ? (await httpCommon.getUser(ticket.executorId)).name : 'Не назначен',
          create_date: this.formatDateTime(ticket.createDate),
          close_date: ticket.closeDate !== undefined ? this.formatDateTime(ticket.closeDate) : '-',
          time_limit: this.formatDateTime(ticket.timeLimit),
          status: (await httpCommon.getTicketStatus(ticket.statusId)).name
        });
      }

      this.loading = false;
    },

    loadFilter() {
      this.filter.category.items = [];
      this.filter.creator.items = [];
      this.filter.executor.items = [];
      this.filter.status.items = [];

      httpCommon.getTicketCategories().then(problemCategories => {
        this.filter.category.items.push({ label: 'Все', value: 'Все' })
        problemCategories.forEach( problemCategory => this.filter.category.items.push({ label: problemCategory.name, value: problemCategory.name }) )
      });
      httpCommon.getUsers().then( users => {
        this.filter.creator.items.push({ label: 'Все', value: 'Все' })
        users.filter(user => user.roleId == 1).forEach( user => this.filter.creator.items.push({ label: user.name, value: user.name }) )
      });
      httpCommon.getUsers().then( users => {
        this.filter.executor.items.push({ label: 'Все', value: 'Все' })
        users.filter(user => user.roleId == 2).forEach( user => this.filter.executor.items.push({ label: user.name, value: user.name }) )
      });
      httpCommon.getTicketStatuses().then(statuses => {
        this.filter.status.items.push({ label: 'Все', value: 'Все' })
        statuses.forEach( status => this.filter.status.items.push({ label: status.name, value: status.name }) )
      });
    },

    // Форматирует объект даты и времени в удобный вид
    formatDateTime(dateTimeObject) {
      return `${this.addNull(dateTimeObject.time.hour)}:${this.addNull(dateTimeObject.time.minute)} ${this.addNull(dateTimeObject.date.day)}.${this.addNull(dateTimeObject.date.month)}.${this.addNull(dateTimeObject.date.year)}`
    },
    addNull(num) {
      return num < 10 ? `0${num}` : num
    },
    clearTable() {
      this.table.items = [];
    },
    openFilterDialog() {
      this.filterDialog.show = true;
    },
    exportExcel() {
      let headers = [];
      this.table.headers.forEach(header => headers.push(header.label));
      jsontoexcel.getXlsx(this.table.items, headers, 'report_' + new Date());
    },
    async filterApply() {
      this.filterDialog.show = false;

      await this.loadTickets();

      this.table.items = this.table.items.filter(item => this.filter.category.value === 'Все' ? item : item.category == this.filter.category.value );
      this.table.items = this.table.items.filter(item => this.filter.creator.value === 'Все' ? item : item.creator == this.filter.creator.value );
      this.table.items = this.table.items.filter(item => this.filter.executor.value === 'Все' ? item : item.executor == this.filter.executor.value );
      this.table.items = this.table.items.filter(item => this.filter.status.value === 'Все' ? item : item.status == this.filter.status.value );
    },
  },
  created() {
    this.loadTickets();
    this.loadFilter();
  }
})
</script>

<template>
  <w-card
      title="Отчеты"
      class="ma4"
      bg-color="base-bg-color"
  >

    <w-flex row class="gap2">
      <w-button
          class="mb4"
          @click="openFilterDialog">
        Фильтр
      </w-button>
      <w-button
          bg-color="success"
          class="mb4"
          @click="exportExcel"
      >
        Экспорт
      </w-button>
    </w-flex>

    <w-table
        v-if="!loading"
        :headers="table.headers"
        :items="table.items"
        mobile-breakpoint="700">
      <template #no-data>
        <w-flex justify-center>
          <w-spinner bounce />
          <div class="align-self-center ml2">Отчет формируется...</div>
        </w-flex>
      </template>
    </w-table>

    <w-flex v-else justify-center>
      <w-spinner bounce />
      <div class="align-self-center ml2">Отчет формируется...</div>
    </w-flex>
  </w-card>

  <!--Диалоговое окно фильтра-->
  <w-dialog
      v-model="filterDialog.show"
      :fullscreen="filterDialog.fullscreen"
      :width="filterDialog.width"
      :persistent="filterDialog.persistent"
      :persistent-no-animation="filterDialog.persistentNoAnimation"
      title-class="primary-light1--bg black"
  >
    <template #title>
      <w-icon class="mr2">mdi mdi-filter-cog</w-icon>
      Фильтр
    </template>

    <w-form
        class="my2 mx4"
    >

      <w-select
        v-model="filter.category.value"
        :items="filter.category.items"
        label="Категория"
        label-position="left"
        outline>
      </w-select>

      <w-select
          v-model="filter.creator.value"
          :items="filter.creator.items"
          label="Создатель"
          label-position="left"
          outline>
      </w-select>

      <w-select
          v-model="filter.executor.value"
          :items="filter.executor.items"
          label="Исполнитель"
          label-position="left"
          outline>
      </w-select>

      <w-select
          v-model="filter.status.value"
          :items="filter.status.items"
          label="Статус"
          label-position="left"
          outline>
      </w-select>

    </w-form>

    <template #actions>
      <div class="spacer"/>
      <w-button
          @click="filterApply"
          class="mr3"
          :loading="filterDialog.form.buttonLoading"
      >
        Применить
      </w-button>
      <w-button @click="filterDialog.show = false">Отмена</w-button>
    </template>
  </w-dialog>

</template>

<style scoped>

</style>