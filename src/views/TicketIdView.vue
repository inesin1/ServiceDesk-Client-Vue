<template>
    <w-card
        v-if="!this.loading"
        :title="'Заявка №' + this.ticket.id"
        bg-color="base-bg-color"
        class="ma4">
        <w-flex column gap="4">

          <!--Панель управления-->
          <w-flex gap="4">
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
                  bg-color="primary"
                  @click="setExecutor(executorSelect.selection)"
              >
                Назначить исполнителя
              </w-button>
            </div>

            <w-button
                v-if="ticket.statusId == 3 && ticket.executorId == $store.getters.getCurrentUser.id && $store.getters.getUserRole != 1"
              bg-color="success"
              @click="closeTicket"
            >
              Выполнено
            </w-button>
          </w-flex>

          <w-divider/>
            
            <w-flex gap="4">
                <div class="w-flex column xs6 gap4">
<!--                  <s-select-field
                      title="Статус"
                      :items="statusSelect.items"
                      :selection="statusSelect.selection"
                      @item-select="statusSelect.selection = $event"
                  />-->
                  <s-text-field
                      title="Статус"
                      :body="ticket.status"
                  />
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

          <w-divider/>

          <div class="w-flex column gap4">
            <div class="title3">Комментарии</div>

            <w-flex column gap="4">
              <s-comment
                  v-for="comment of comments.list"
                  :key="comment.id"

                  :userId="comment.userId"
                  :text="comment.text"
                  :date="formatDateTime(comment.createDate)"
              />
            </w-flex>

            <w-divider/>

            <w-flex column gap="4">
              <w-textarea
                  v-model="comments.newComment"
                  outline
                  inner-icon-left="mdi mdi-email">
              </w-textarea>

              <w-button class="align-self-start" @click="createComment()">
                Отправить
              </w-button>
            </w-flex>
          </div>
        </w-flex>
    </w-card>

  <w-flex v-else justify-center class="mt4">
    <w-spinner bounce/>
  </w-flex>
</template>

<script>

import httpCommon from "@/http-common";
import router from "@/router";
import SComment from "@/components/SComment.vue";
import store from "@/store";

export default {
  name: "TicketIdView",
  components: {SComment},
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
      },
      statusSelect: {
        items: [],
        selection: null
      },
      comments: {
        list: [],
        newComment: null,
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
      this.statusSelect.selection = ticketData.statusId;

      this.loading = false;
    },

    loadExecutors() {
      httpCommon.getUsersIT().then(executors => {
        executors.forEach(e => this.executorSelect.items.push({ label: e.name, value: e.id }))
      })
    },

    loadStatuses() {
      httpCommon.getStatuses().then(statuses => statuses.forEach(status => this.statusSelect.items.push( { label: status.name, value: status.id } )))
    },

    // Загружает комментарии к заявке
    loadComments() {
      httpCommon.getCommentsForTicket(this.ticket.id)
          .then(res => this.comments.list = res);
    },

    // Создает новый комментарий
    createComment() {
      httpCommon.postComment({
        ticketId: this.ticket.id,
        userId: store.getters.getCurrentUser.id,
        text: this.comments.newComment
      })
          .then(res => {console.log(res); this.loadComments();})
          .catch(error => this.$waveui.notify(`Произошла ошибка: ${error.message}`, 'error'))
    },

    // Создает системный комментарий
    createSystemComment(text) {
      httpCommon.postComment({
        ticketId: this.ticket.id,
        userId: 1,
        text: text
      })
          .then(res => {console.log(res); this.loadComments();})
          .catch(error => this.$waveui.notify(`Произошла ошибка: ${error.message}`, 'error'))
    },

    formatDateTime(dateTimeObject) {
      if (dateTimeObject !== null)
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
          setTimeout(() => this.loadTicketData(), 1000);
          setTimeout(() => this.createSystemComment(`Назначен исполнитель: ${this.ticket.executor}`), 3000);
        })
        .catch(error => this.$waveui.notify(`Произошла ошибка: ${error.message}`, 'error'));
    },
    closeTicket() {
      httpCommon.closeTicket(this.ticket.id).then(response => {
        this.$waveui.notify('Заявка выполнена!', 'success');
        setTimeout(() => this.loadTicketData(), 1000);
        setTimeout(() => this.createSystemComment(`Статус заявки изменен на: ${this.ticket.status}`), 3000);
      });
    }
  },
  async created() {
    await this.loadTicketData();
    this.loadComments();
    this.loadExecutors();
    this.loadStatuses();
  }
}
</script>

<style scoped>

</style>