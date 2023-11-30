<template>
    <w-card
            title="Заявки"
            bg-color="base-bg-color"
            class="ma4">
      <w-flex class="mb4" row gap="2">
        <w-button
            @click="openCreateTicketDialog">
          Создать
        </w-button>
        <w-button
            @click="loadTickets(table.pagination)">
          <w-icon>mdi mdi-reload</w-icon>
        </w-button>
      </w-flex>

      <!-- Фильтр -->
      <s-tickets-filter
        @apply="applyFilter"
      />

      <w-table
          :headers="table.headers"
          :items="table.items"
          :fetch="loadTickets"
          :pagination="table.pagination"
          :loading="table.loading"
          selectable-rows="1"
          @row-select="$router.push({name: 'ticketId', params: { id: $event.item.id }})"
          fixed-headers
          style="height: 530px"
          v-model:sort="table.sort"
          :filter="filterView.keywordFilter(filterView)"
          :mobile-breakpoint="700">
        <template #header-label="{ label, index }">
          <w-input outline placeholder="Поиск..." inner-icon-left="wi-search" v-model="filterView.keyword[index]" class="mb2"></w-input>
          {{ label }}
        </template>
        <template #no-data>
          <div class="align-self-center ml2">Нет данных</div>
        </template>
      </w-table>
    </w-card>

  <s-create-ticket-dialog
      :show="createTicketDialog.show"
      @loadTickets="loadTickets(table.pagination)"
      @close="createTicketDialog.show = false"
  />
</template>

<script>
import httpCommon from "@/http-common";
import HttpCommon from "@/http-common";
import SCreateTicketDialog from "@/components/dialog-windows/SCreateTicketDialog.vue";
import STicketsFilter from "@/components/STicketsFilter.vue";

export default {
  name: "TicketsView",
  components: {STicketsFilter, SCreateTicketDialog},
  data: () => ({
    // Таблица заявок
    table: {
      headers: [
        {label: 'ID', key: 'id', sortable: false},
        {label: 'Категория', key: 'category', sortable: false},
        {label: 'Заявитель', key: 'creator', sortable: false},
        {label: 'Исполнитель', key: 'executor', sortable: false},
        {label: 'Дата создания', key: 'created_at', sortable: false},
        {label: 'Дата закрытия', key: 'closed_at', sortable: false},
        {label: 'Срок', key: 'time_limit', sortable: false},
        {label: 'Статус', key: 'status', sortable: false}
      ],
      items: [],
      pagination: {
        itemsPerPage: 10,
        itemsPerPageOptions: [10, 50, 100, { label: 'Все', value: 0 }],
        start: 1,
        total: 100
      },
      loading: false,
      sort: '-id'
    },

    // Фильтр
/*    filter: {
      statuses: [1, 3],
      departments: this.userStore.user.departments,
    },*/

    filterView: {
      keyword: [],
      keywordFilter: filter => item => {
        new RegExp(filter.keyword[2], 'i').test(item.category) &&
        new RegExp(filter.keyword[3], 'i').test(item.creator) &&
        new RegExp(filter.keyword[4], 'i').test(item.executor) &&
        new RegExp(filter.keyword[5], 'i').test(item.create_date) &&
        new RegExp(filter.keyword[6], 'i').test(item.close_date) &&
        new RegExp(filter.keyword[7], 'i').test(item.time_limit) &&
        new RegExp(filter.keyword[8], 'i').test(item.status)
      }
    },
    
    // Диалоговое окно создания заявки
    createTicketDialog: {
      show: false
    }
  }),
  methods: {
    // Загружает заявки
    async loadTickets({start, itemsPerPage}) {
      this.table.loading = 'header'
      this.table.items = [];
      this.table.pagination.total = await httpCommon.getTicketsCount()

      const filter = JSON.parse(localStorage.getItem('ticketsFilter'))
      const tickets = await httpCommon.getTickets(start - 1, itemsPerPage, filter);
      tickets.map(ticket => {
        this.table.items.push({
          id: ticket.id,
          category: ticket.category.name,
          creator: ticket.creator.name,
          executor: ticket.executor !== undefined ? ticket.executor.name : 'Не назначен',
          created_at: ticket.createdAt,
          closed_at: ticket.closedAt !== undefined ? ticket.closedAt : '-',
          time_limit: ticket.timeLimit,
          status: ticket.status.name
        });
      })

      this.table.loading = false
    },

    // Открывает диалоговое окно создания заявки
    openCreateTicketDialog() {
      this.createTicketDialog.show = true;
    },
  },
}
</script>

<style>
    .w-table__row {
        cursor: pointer;
    }
</style>