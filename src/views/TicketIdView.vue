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
                v-if="ticket.executor === undefined && userStore.user.role.id !== 1"
                bg-color="success"
                class="align-self-start"
                @click="setExecutor(userStore.user.id)">
              Принять в работу
            </w-button>

            <div
                v-else-if="userStore.user.role.id === 3"
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
                v-if="ticket.status.id === 3 && ticket.executor.id === userStore.user.id && userStore.user.role.id !== 1"
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
                      :body="ticket.status.name"
                  />
                  <s-text-field
                      title="Источник"
                      :body="ticket.source.name"
                  />
                  <s-text-field
                      title="Создатель"
                      :body="ticket.creator.name"
                      :link="{name: 'profile', params: {id: ticket.creatorId}}"
                  />
                  <s-text-field
                      v-if="ticket.executor !== undefined"
                      title="Исполнитель"
                      :body="ticket.executor.name"
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
                            :body="ticket.createdAt"
                    />
                    <s-text-field
                            title="Дата закрытия"
                            :body="ticket.closedAt !== undefined ? ticket.closedAt : '-'"
                    />
                  <s-text-field
                      title="Срок"
                      :body="ticket.timeLimit"
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

          <w-divider/>

          <div class="w-flex column gap4">
            <div class="title3">Комментарии</div>

            <w-flex column gap="4">
              <s-comment
                  v-for="comment of comments.list"
                  :key="comment.id"

                  :creatorId="comment.creator.id"
                  :text="comment.text"
                  :date="comment.createdAt"
              />
            </w-flex>

            <w-divider/>

            <w-flex column gap="4">
              <w-textarea
                  v-model="comments.newComment"
                  outline
                  inner-icon-left="mdi mdi-email">
              </w-textarea>

              <w-button class="align-self-start" @click="createComment">
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
import SComment from "@/components/SComment.vue";
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user";

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
        source: {
          id: null,
          name: null
        },
        timeLimit: null,
        createdAt: null,
        closedAt: null,
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
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    async loadTicketData() {
      this.loading = true;

      this.ticket = await httpCommon.getTicket(this.ticket.id);

      this.loading = false;
    },

    loadExecutors() {
      httpCommon.getUsersIT().then(executors => {
        executors.forEach(e => this.executorSelect.items.push({ label: e.name, value: e.id }))
      })
    },

    loadStatuses() {
      httpCommon.getTicketStatuses().then(statuses => statuses.forEach(status => this.statusSelect.items.push( { label: status.name, value: status.id } )))
    },

    // Загружает комментарии к заявке
    async loadComments() {
      this.comments.list = await httpCommon.getTicketComments(this.ticket.id)
    },

    // Создает новый комментарий
    createComment() {
      httpCommon.createTicketComment(this.ticket.id, {
        creatorId: this.userStore.user.id,
        text: this.comments.newComment
      })
          .then(res => {console.log(res); this.loadComments();})
          .catch(error => this.$waveui.notify(`Произошла ошибка: ${error.message}`, 'error'))
    },

    // Создает системный комментарий
    async createSystemComment(text) {
      try {
        await httpCommon.createTicketComment(this.ticket.id, {
          creatorId: 1,
          text: text
        })

        await this.loadComments()
      } catch (e) {
        console.log(`Произошла ошибка: ${e.message}`);
        this.$waveui.notify(`Произошла ошибка: ${e.message}`, 'error')
      }
    },
    
    // Устанавливает указанного пользователя в качестве исполнителя заявки и меняет статус на "В работе"
    async setExecutor(executorId) {
      try {
        await httpCommon.putTicketToWork(this.ticket.id, executorId)
        await this.loadTicketData()
        this.createSystemComment(`Назначен исполнитель: ${this.ticket.executor.name}`)
        this.$waveui.notify('Исполнитель назначен!', 'success');
      } catch (e) {
        console.log(`Произошла ошибка: ${e.message}`);
        this.$waveui.notify(`Произошла ошибка: ${e.message}`, 'error')
      }
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
    //this.loadStatuses();
  }
}
</script>

<style scoped>

</style>