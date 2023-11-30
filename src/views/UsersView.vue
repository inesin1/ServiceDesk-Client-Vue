<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user";
import SCreateUserDialog from "@/components/dialog-windows/SCreateUserDialog.vue";
import SCreateTicketDialog from "@/components/dialog-windows/SCreateTicketDialog.vue";
import SEditUserDialog from "@/components/dialog-windows/SEditUserDialog.vue";

export default defineComponent({
  name: "UsersView",
  components: {SEditUserDialog, SCreateTicketDialog, SCreateUserDialog},
  data: () => ({
    table: {
      headers: [
        {label: 'ID', key: 'id', sortable: false},
        {label: 'ФИО', key: 'name', sortable: false},
        {label: 'Логин', key: 'login', sortable: false},
        {label: 'Пароль', key: 'password', sortable: false},
        {label: 'Роль', key: 'role', sortable: false},
        {label: 'Отделения', key: 'departments', sortable: false},
        {label: 'Номер телефона', key: 'phone', sortable: false},
        {label: 'Chat ID', key: 'tg_chat_id', sortable: false},
      ],
      items: [],
      loading: false,
      sort: '+id',
      selection: null,
      deleteButtonDisable: true
    },

    // Фильтр
    filter: {
      keyword: [],
      keywordFilter: filter => item => {
        return new RegExp(filter.keyword[1], 'i').test(item.id) &&
            new RegExp(filter.keyword[2], 'i').test(item.name) &&
            new RegExp(filter.keyword[3], 'i').test(item.login) &&
            new RegExp(filter.keyword[4], 'i').test(item.password) &&
            new RegExp(filter.keyword[5], 'i').test(item.role) &&
            new RegExp(filter.keyword[6], 'i').test(item.department) &&
            new RegExp(filter.keyword[7], 'i').test(item.phone_number) &&
            new RegExp(filter.keyword[8], 'i').test(item.tg_chat_id)
      }
    },

    editUserDialog: {
      show: false,
      fullscreen: false,
      persistent: false,
      persistentNoAnimation: false,
      width: 1000,

      userId: null,
    },

    createUserDialog: {
      show: false,
    },

    uploadUsersDialog: {
      show: false,
      fullscreen: false,
      persistent: false,
      persistentNoAnimation: false,
      width: 1000,

      form: {
        valid: null,
        submitted: false,
        sent: false,
        errorsCount: 0,

        fields: {
          file: [],
          rewrite: false
        }
      }
    },
  }),
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    async loadUsers() {
      this.table.loading = 'header'
      this.table.items = [];

      const users = await httpCommon.getUsers("departments");
      users.map(user => {
        this.table.items.push(
            {
              id: user.id,
              name: user.name,
              login: user.login,
              password: user.password,
              role: user.role.name,
              departments: user.departments.map(d => d.name),
              phone: user.phone,
              tg_chat_id: user.tgChatId
            }
        )
      })

      this.table.loading = false
    },

    // Открывает диалоговое окно создания пользователя
    openCreateUserDialog() {
      this.createUserDialog.show = true;
    },

    // Открывает диалоговое окно загрузки пользователей
    openUploadUsersDialog() {
      this.uploadUsersDialog.show = true;
    },

    // Обрабатывает событие выбора пользователя
    rowSelection(event) {
      this.editUserDialog.show = true;
      this.editUserDialog.userId = event.item.id;
    },

    // Вызывается при успешной проверке формы создания
    uploadUsersFormOnSuccess () {
      this.uploadUsersDialog.form.sent = true

      httpCommon.uploadUsers(this.uploadUsersDialog.form.fields.file, this.uploadUsersDialog.form.fields.rewrite)
          .then(
              data => {this.$waveui.notify('Пользователи успешно загружены!', 'success', 0); this.uploadUsersDialog.show = false},
              error => this.$waveui.notify(`Возникла ошибка: ${error}`, 'error', 0)

          )
    },

    // Вызывается при проверке полей формы создания
    uploadUsersFormOnValidate () {
      this.uploadUsersDialog.form.sent = false
      this.uploadUsersDialog.form.submitted = this.uploadUsersDialog.form.errorsCount === 0
    },

    // Закрывает окно загрузки пользователей
    closeUploadUsersDialog() {
      this.uploadUsersDialog.show = false
    },
  },
  created() {
    this.loadUsers();
  }
})
</script>

<template>
  <w-card
      title="Пользователи"
      bg-color="base-bg-color"
      class="ma4">

    <w-flex row class="gap2 mb4">
      <w-button
          bg-color="success"
          @click="openCreateUserDialog">
        Создать
      </w-button>
      <w-button
          bg-color="success"
          disabled
          @click="openUploadUsersDialog">
        Загрузить
      </w-button>
      <w-button
          @click="loadUsers">
        <w-icon>mdi mdi-reload</w-icon>
      </w-button>
    </w-flex>

    <w-table
        :headers="table.headers"
        :items="table.items"
        :loading="table.loading"
        selectable-rows="1"
        @row-select="rowSelection($event)"
        fixed-headers
        style="height: 500px"
        :filter="filter.keywordFilter(filter)"
        v-model:sort="table.sort"
        :mobile-breakpoint="700">
      <template #no-data>
        <div class="align-self-center ml2">Нет данных</div>
      </template>
      <template #header-label="{ label, index }">
        <w-input outline placeholder="Поиск..." inner-icon-left="wi-search" v-model="filter.keyword[index]" class="mb2"></w-input>
        {{ label }}
      </template>
    </w-table>
  </w-card>

  <!--Диалоговое окно создания пользователя-->
  <s-create-user-dialog
    :show="createUserDialog.show"
    @loadUsers="loadUsers"
    @close="createUserDialog.show = false"
  />

  <!--Диалоговое окно редактирования пользователя-->
  <s-edit-user-dialog
    v-if="editUserDialog.show"
    :user-id="editUserDialog.userId"
    @loadUsers="loadUsers"
    @close="editUserDialog.show = false"
  />

  <!--Диалоговое окно загрузки пользователей-->
  <w-dialog
      v-model="uploadUsersDialog.show"
      :fullscreen="uploadUsersDialog.fullscreen"
      :width="uploadUsersDialog.width"
      :persistent="uploadUsersDialog.persistent"
      :persistent-no-animation="uploadUsersDialog.persistentNoAnimation"
      @close="uploadUsersDialog.form.valid = null"
      title-class="primary-light1--bg black">

    <template #title>
      <w-icon class="mr2">mdi mdi-upload</w-icon>
      Загрузить пользователей
    </template>

    <div class="caption">Формат файла: CSV (txt) (Разделитель табуляция)<br>Кодировка: UTF-8<br>Порядок данных как в таблице (без id)</div>
    <w-form
        ref="uploadUsersForm"
        v-model="uploadUsersDialog.form.valid"
        v-model:errors-count="uploadUsersDialog.form.errorsCount"
        @validate="uploadUsersFormOnValidate"
        @success="uploadUsersFormOnSuccess"
    >
      <w-input
          type="file"
          v-model="uploadUsersDialog.form.fields.file"
          :validators="[() => uploadUsersDialog.form.fields.file.length || 'Выберите файл!']"
          class="mt6 mb4">
        Нажмите для выбора файла
      </w-input>
      <w-checkbox v-if="userStore.user.role.id == 3" v-model="uploadUsersDialog.form.fields.rewrite" >Перезаписать <br><div class="caption">Полная очистка базы перед записью</div></w-checkbox>
    </w-form>

    <template #actions>
      <div class="spacer"/>
      <w-button @click="$refs.uploadUsersForm.validate()" class="mr3">Загрузить</w-button>
      <w-button @click="closeUploadUsersDialog">Отмена</w-button>
    </template>
  </w-dialog>
</template>

<style scoped>

</style>