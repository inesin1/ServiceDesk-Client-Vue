<template>
    <w-card
        :title="'Заявка №' + this.ticket.id"
        bg-color="grey-dark6"
        class="ma4">
        <w-flex column gap="4">
            <w-button
                v-if="ticket.executor === null"
                bg-color="success"
                class="align-self-start"
                @click="takeToWork()">
                Принять в работу
            </w-button>
            
            <w-flex gap="4">
                <div class="w-flex column xs6 gap4">
                    <s-text-field
                            title="Создатель"
                            :body="ticket.creator.name"
                            :link="{name: 'profile', params: {id: ticket.creator.id}}"
                    />
                    <s-text-field
                            v-if="ticket.executor !== null"
                            title="Исполнитель"
                            :body="ticket.executor.name"
                            :link="{name: 'profile', params: {id: ticket.executor.id}}"
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
                </div>
            </w-flex>
            <w-divider/>

            <div class="w-flex column gap4">
                <s-text-field
                        title="Категория"
                        :body="ticket.category.name"
                />
                <s-text-field
                        title="Подробности"
                        :body="ticket.details"
                />
            </div>
        </w-flex>
    </w-card>
</template>

<script>

import httpCommon from "@/http-common";
import router from "@/router";

export default {
  name: "TicketIdView",
  data: function() {
    return {
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
    }
  },
  methods: {
    formatDateTime(dateTimeObject) {
      return `${this.addNull(dateTimeObject.time.hour)}:${this.addNull(dateTimeObject.time.minute)} ${this.addNull(dateTimeObject.date.day)}.${this.addNull(dateTimeObject.date.month)}.${this.addNull(dateTimeObject.date.year)}`
    },
    addNull(num) {
      return num < 10 ? `0${num}` : num
    },
    
    // Устанавливает текущего пользователя в качестве исполнителя заявки и меняет статус на "В работе"
    takeToWork() {
      httpCommon.putTicket(this.ticket.id, this.$store.getters.getCurrentUser.id)
        .then(response => {this.$waveui.notify('Заявка принята в работу!', 'success'); this.ticket.executor = this.$store.getters.getCurrentUser.name})
        .catch(error => this.$waveui.notify(`Произошка ошибка: ${error.message}`, 'error'));
    }
  },
  async created() {
    const ticketData = await httpCommon.getTicket(this.ticket.id);
    Object.assign(
      this.ticket,
      ticketData,
      {creator: await httpCommon.getUser(ticketData.creatorId)},
      {executor: ticketData.executorId !== undefined ? await httpCommon.getUser(ticketData.executorId) : null},
      {status: await httpCommon.getStatus(ticketData.statusId)},
      {category: await httpCommon.getProblemCategory(ticketData.categoryId)},
    );
  }
}
</script>

<style scoped>

</style>