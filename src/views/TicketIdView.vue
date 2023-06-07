<template>
    <w-card
        :title="'Заявка №' + this.ticket.id"
        bg-color="grey-dark6"
        class="ma4">
        <w-flex column gap="4">
          <w-button
              v-if="ticket.executor === null && $store.getters.getUserRole == 2"
              bg-color="success"
              class="align-self-start"
              @click="setExecutor($store.getters.getCurrentUser.id)">
            Принять в работу
          </w-button>

          <div
              v-else-if="$store.getters.getUserRole == 3"
              class="w-flex row gap2">
            <w-select
                :items="executorSelect.items"
                @item-select="executorSelect.selection = $event.value"
            ></w-select>

            <w-button
                bg-color="success"
                @click="setExecutor(executorSelect.selection)"
            >
              Назначить исполнителя
            </w-button>
          </div>

          <w-divider/>
            
            <w-flex gap="4">
                <div class="w-flex column xs6 gap4">
                    <s-text-field
                            title="Создатель"
                            :body="ticket.creator"
                            :link="{name: 'profile', params: {id: ticket.creatorId}}"
                    />
                    <s-text-field
                            v-if="ticket.executor !== null"
                            title="Исполнитель"
                            :body="ticket.executor"
                            :link="{name: 'profile', params: {id: ticket.executorId}}"
                    />
                    <s-text-field
                            v-else
                            title="Исполнитель"
                            body="Не назначен"
                    />
                </div>
                <w-divider vertical/>
                <div class="w-flex column xs6 gap4">
                    <s-text-field
                            title="Дата создания"
                            :body="formatDateTime(ticket.createDate)"
                    />
                    <s-text-field
                            title="Дата закрытия"
                            :body="ticket.closeDate !== null ? formatDateTime(ticket.closeDate) : '-'"
                    />
                  <s-text-field
                      title="Срок"
                      :body="formatDateTime(ticket.timeLimit)"
                  />
                </div>
            </w-flex>
            <w-divider/>

            <div class="w-flex column gap4">
                <s-text-field
                        title="Категория"
                        :body="ticket.category"
                />
                <s-text-field
                        title="Подробности"
                        :body="ticket.details"
                />
            </div>

<!--          <w-divider/>

          <div class="w-flex column gap4">
            <div class="title3">Комментарии</div>

          </div>-->
        </w-flex>
    </w-card>

  <w-spinner v-if="this.loading" bounce/>
</template>

<script>

import httpCommon from "@/http-common";
import router from "@/router";

export default {
  name: "TicketIdView",
  data: function() {
    return {
      loading: false,
      ticket: {
        id: this.$route.params.id,
        creator: null,
        executor: null,
        category: null,
        details: null,
        status: null,
        timeLimit: null,
        createDate: null,
        closeDate: null,
      },
      executorSelect: {
        items: [],
        selection: null
      }
    }
  },
  methods: {
    async loadTicketData() {
      this.loading = true;

      const ticketData = await httpCommon.getTicket(this.ticket.id);
      Object.assign(
          this.ticket,
          ticketData,
          {creator: (await httpCommon.getUser(ticketData.creatorId)).name},
          {executor: ticketData.executorId !== undefined ? (await httpCommon.getUser(ticketData.executorId)).name : null},
          {status: (await httpCommon.getStatus(ticketData.statusId)).name},
          {category: (await httpCommon.getProblemCategory(ticketData.categoryId)).name},
      );

      this.loading = false;
    },

    loadExecutors() {
      httpCommon.getUsers().then(users => {
        users.filter(user => user.roleId == 2).forEach(e => this.executorSelect.items.push({ label: e.name, value: e.id }))
      })
    },

    formatDateTime(dateTimeObject) {
      return `${this.addNull(dateTimeObject.time.hour)}:${this.addNull(dateTimeObject.time.minute)} ${this.addNull(dateTimeObject.date.day)}.${this.addNull(dateTimeObject.date.month)}.${this.addNull(dateTimeObject.date.year)}`
    },
    addNull(num) {
      return num < 10 ? `0${num}` : num
    },
    
    // Устанавливает указанного пользователя в качестве исполнителя заявки и меняет статус на "В работе"
    setExecutor(executorId) {
      httpCommon.putTicket(this.ticket.id, executorId)
        .then(async response => {
          this.$waveui.notify('Исполнитель назначен!', 'success');
          this.ticket.executor = (await httpCommon.getUser(executorId)).name
        })
        .catch(error => this.$waveui.notify(`Произошла ошибка: ${error.message}`, 'error'));
    }
  },
  async created() {
    await this.loadTicketData();
    this.loadExecutors();
  }
}
</script>

<style scoped>

</style>