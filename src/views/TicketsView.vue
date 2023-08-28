<template>
    <w-card
            title="Заявки"
            bg-color="base-bg-color"
            class="ma4">
        <w-button
            class="mb4"
            @click="openCreateTicketDialog">
            Создать
        </w-button>
        <w-table
                :headers="table.headers"
                :items="table.items"
                selectable-rows="1"
                @row-select="$router.push({name: 'ticketId', params: { id: $event.item.id }})"
                fixed-headers
                style="height: 500px"
                v-model:sort="table.sort"
                mobile-breakpoint="700">
            <template #no-data>
                <w-flex justify-center>
                    <w-spinner bounce />
                    <div class="align-self-center ml2">Загрузка</div>
                </w-flex>
            </template>
        </w-table>
    </w-card>

    <w-dialog
            v-model="createTicketDialog.show"
            :fullscreen="createTicketDialog.fullscreen"
            :width="createTicketDialog.width"
            :persistent="createTicketDialog.persistent"
            :persistent-no-animation="createTicketDialog.persistentNoAnimation"
            @close="createTicketDialog.form.valid = null"
            title-class="primary-light1--bg black">
        <template #title>
            <w-icon class="mr2">mdi mdi-pencil-outline</w-icon>
            Создать заявку
        </template>

        <div class="message-box">
            <w-transition-fade>
                <w-alert
                        v-if="createTicketDialog.form.valid === false"
                        error
                        no-border
                        class="my0 text-light">
                    Имеются ошибки
                </w-alert>
            </w-transition-fade>
        </div>

        <w-form
            v-model="createTicketDialog.form.valid"
            v-model:errors-count="createTicketDialog.form.errorsCount"
            @validate="onValidate"
            @success="onSuccess"
            ref="createTicketForm"
            class="my2 mx4">

            <w-select
                v-model="createTicketDialog.form.categorySelect.value"
                :items="createTicketDialog.form.categorySelect.items"
                label="Категория"
                required
                :validators="[createTicketDialog.form.validators.required]"
                class="my4"
            ></w-select>
            
            <w-textarea v-model="createTicketDialog.form.details">Что случилось?</w-textarea>
        </w-form>
        
        <template #actions>
            <div class="spacer" />
            <w-button
                    @click="$refs.createTicketForm.validate()"
                    class="mr3"
                    :loading="createTicketDialog.form.buttonLoading"
            >
                Создать
            </w-button>
            <w-button @click="createTicketDialog.show = false">Отмена</w-button>
        </template>
    </w-dialog>
</template>

<script>
import httpCommon from "@/http-common";
import HttpCommon from "@/http-common";

export default {
  name: "TicketsView",
  data: () => ({
    // Таблица заявок
    table: {
      headers: [
        {label: 'ID', key: 'id'},
        {label: 'Категория', key: 'category'},
        {label: 'Создатель', key: 'creator'},
        {label: 'Исполнитель', key: 'executor'},
        {label: 'Дата создания', key: 'create_date'},
        {label: 'Дата закрытия', key: 'close_date'},
        {label: 'Срок', key: 'time_limit'},
        {label: 'Статус', key: 'status'}
      ],
      items: [],
      sort: '+status'
    },
    
    // Диалоговое окно создания заявки
    createTicketDialog: {
      show: false,
      fullscreen: false,
      persistent: false,
      persistentNoAnimation: false,
      width: 1000,
      
      // Форма
      form: {
        valid: null,
        submitted: false,
        sent: false,
        errorsCount: 0,
        validators: {
          required: value => !!value || 'Поле обязательно для заполнения',
        },
        buttonLoading: false,
        categorySelect: {
          value: '',
          items: [],
        },
        details: null
      },
    }
  }),
  methods: {
    // Загружает заявки
    async loadTickets() {
      this.table.items = [];
      const tickets = (await httpCommon.getTickets()).reverse();
      for (const ticket of tickets) {
        this.table.items.push({
          id: ticket.id,
          category: (await httpCommon.getProblemCategory(ticket.categoryId)).name,
          creator: (await httpCommon.getUser(ticket.creatorId)).name,
          executor: ticket.executorId !== undefined ? (await httpCommon.getUser(ticket.executorId)).name : 'Не назначен',
          create_date: this.formatDateTime(ticket.createDate),
          close_date: ticket.closeDate !== undefined ? this.formatDateTime(ticket.closeDate) : '-',
          time_limit: this.formatDateTime(ticket.timeLimit),
          status: (await httpCommon.getStatus(ticket.statusId)).name
        });
      }
    },
    
    // Форматирует объект даты и времени в удобный вид
    formatDateTime(dateTimeObject) {
      return `${this.addNull(dateTimeObject.time.hour)}:${this.addNull(dateTimeObject.time.minute)} ${this.addNull(dateTimeObject.date.day)}.${this.addNull(dateTimeObject.date.month)}.${this.addNull(dateTimeObject.date.year)}`
    },
    addNull(num) {
      return num < 10 ? `0${num}` : num
    },
    
    // Вызывается при успешной проверке формы
    onSuccess () {
      this.createTicketDialog.form.buttonLoading = true;
      this.createTicketDialog.form.sent = true
      
      httpCommon.postTicket({
        categoryId: this.createTicketDialog.form.categorySelect.value,
        details: this.createTicketDialog.form.details
      })
        .then( response => {
          this.createTicketDialog.show = false;
          this.$waveui.notify('Заявка успешно создана!', 'success');
          this.loadTickets();
        })
        .catch(error => this.$waveui.notify('При создании заявки произошла ошибка: ' + error.message, 'error'))
        .finally(this.createTicketDialog.form.buttonLoading = false);
    },
    
    // Вызывается при проверке полей формы
    onValidate () {
      this.createTicketDialog.form.sent = false
      this.createTicketDialog.form.submitted = this.createTicketDialog.form.errorsCount === 0
    },
    
    // Открывает диалоговое окно создания заявки
    openCreateTicketDialog() {
      this.createTicketDialog.show = true;
      httpCommon.getProblemCategories().then( problemCategories => {
        problemCategories.forEach( problemCategory => this.createTicketDialog.form.categorySelect.items.push({ label: problemCategory.name, value: problemCategory.id }) )
      })
    },
  },
  created() {
    this.loadTickets();
  }
}
</script>

<style>
    .w-table__row {
        cursor: pointer;
    }
</style>