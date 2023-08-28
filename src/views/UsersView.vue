<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";
import store from "@/store";

export default defineComponent({
  name: "UsersView",
  data: () => ({
    table: {
      headers: [
        {label: 'ID', key: 'id'},
        {label: 'ФИО', key: 'name'},
        {label: 'Логин', key: 'login'},
        {label: 'Пароль', key: 'password'},
        {label: 'Роль', key: 'role'},
        {label: 'Отделение', key: 'department'},
        {label: 'Номер телефона', key: 'phone_number'},
        {label: 'Chat ID', key: 'chat_id'},
      ],
      items: [],
      selection: null,
      deleteButtonDisable: true
    },

    createUserDialog: {
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
        validators: {
          required: value => !!value || 'Поле обязательно для заполнения!',
        },
        buttonLoading: false,

        fields: {
          name: '',
          login: '',
          password: '',
          role: {
            value: 1,
            items: [],
            disable: true
          },
          department: {
            value: '',
            items: []
          },
          phone_number: '',
          tg_chat_id: ''
        }
      }
    },

    editUserDialog: {
      show: false,
      fullscreen: false,
      persistent: false,
      persistentNoAnimation: false,
      width: 1000,

      user: null,

      form: {
        valid: null,
        submitted: false,
        sent: false,
        errorsCount: 0,
        validators: {
          required: value => !!value || 'Поле обязательно для заполнения!',
        },
        buttonLoading: false,

        fields: {
          name: '',
          login: '',
          password: '',
          role: {
            value: 1,
            items: [],
            disable: true
          },
          department: {
            value: '',
            items: []
          },
          phone_number: '',
          tg_chat_id: ''
        }
      }
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
  methods: {
    async loadUsers() {
      this.table.items = [];
      const users = await httpCommon.getUsers();
      for (const user of users) {
        this.table.items.push(
            {
              id: user.id,
              name: user.name,
              login: user.login,
              password: user.password,
              role: (await httpCommon.getRole(user.role.id)).name,
              department: (await httpCommon.getDepartment(user.department.id)).name,
              phone_number: user.phoneNumber,
              tg_chat_id: user.tgChatId
            }
        )
      }
    },

    // Открывает диалоговое окно создания пользователя
    async openCreateUserDialog() {
      this.createUserDialog.show = true;

      this.createUserDialog.form.fields.role.items = [];
      (await httpCommon.getRoles()).forEach((role => this.createUserDialog.form.fields.role.items.push({
        label: role.name,
        value: role.id
      })));

      this.createUserDialog.form.fields.department.items = [];
      (await httpCommon.getDepartments()).forEach((department => this.createUserDialog.form.fields.department.items.push({
        label: department.name,
        value: department.id
      })))
    },

    // Открывает диалоговое окно загрузки пользователей
    openUploadUsersDialog() {
      this.uploadUsersDialog.show = true;
    },

    // Обрабатывает событие выбора пользователя
    rowSelection(event) {
      this.editUserDialog.show = true;
      this.editUserDialog.user = event.item;
    },

    // Удаляет выбранную запись
    deleteSelectedItem() {
      httpCommon.deleteUser(this.table.selection.id)
    },

    // Вызывается при успешной проверке формы создания
    createUserFormOnSuccess () {
      this.createUserDialog.form.buttonLoading = true;
      this.createUserDialog.form.sent = true

      httpCommon.postUser({
        name: this.createUserDialog.form.fields.name,
        login: this.createUserDialog.form.fields.login,
        password: this.createUserDialog.form.fields.password,
        roleId: this.createUserDialog.form.fields.role.value,
        departmentId: this.createUserDialog.form.fields.department.value,
        phoneNumber: this.createUserDialog.form.fields.phone_number,
        tgChatId: this.createUserDialog.form.fields.tg_chat_id,
      })
          .then( response => {
            this.createUserDialog.show = false;
            this.$waveui.notify('Пользователь успешно создан!', 'success');
            this.loadUsers();
          })
          .catch(error => this.$waveui.notify('При создании пользователя произошла ошибка: ' + error.message, 'error'))
          .finally(this.createUserDialog.form.buttonLoading = false);
    },

    // Вызывается при проверке полей формы создания
    createUserFormOnValidate () {
      this.createUserDialog.form.sent = false
      this.createUserDialog.form.submitted = this.createUserDialog.form.errorsCount === 0
    },

    // Вызывается при успешной проверке формы редактирования
    async editUserFormOnSuccess() {
      this.editUserDialog.form.buttonLoading = true;
      this.editUserDialog.form.sent = true

      let user = (await httpCommon.getUser(this.editUserDialog.user.id));

      httpCommon.putUser(this.editUserDialog.user.id, {
        name: this.editUserDialog.user.name,
        login: this.editUserDialog.user.login,
        password: this.editUserDialog.user.password,
        roleId: user.roleId,
        departmentId: user.departmentId,
        phoneNumber: this.editUserDialog.user.phone_number,
        tgChatId: this.editUserDialog.user.tg_chat_id,
      })
          .then(response => {
            this.editUserDialog.show = false;
            //this.loadUsers();
          })
          .catch(error => this.$waveui.notify('При редактировании пользователя произошла ошибка: ' + error.message, 'error'))
    },

    // Вызывается при проверке полей формы редактирования
    editUserFormOnValidate () {
      this.editUserDialog.form.sent = false
      this.editUserDialog.form.submitted = this.editUserDialog.form.errorsCount === 0
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

    if (store.getters.getUserRole == 3)
      this.createUserDialog.form.fields.role.disable = false;
      this.editUserDialog.form.fields.role.disable = false;
  }
})
</script>

<template>
  <w-card
      title="Пользователи"
      bg-color="base-bg-color"
      class="ma4">

    <w-flex row class="gap2">
      <w-button
          bg-color="success"
          class="mb4"
          @click="openCreateUserDialog">
        Создать
      </w-button>
      <w-button
          bg-color="success"
          class="mb4"
          @click="openUploadUsersDialog">
        Загрузить
      </w-button>
    </w-flex>

    <w-table
        :headers="table.headers"
        :items="table.items"
        :pagination="table.pagination"
        selectable-rows="1"
        @row-select="rowSelection($event)"
        fixed-headers
        mobile-breakpoint="700">
      <template #no-data>
        <w-flex justify-center>
          <w-spinner bounce />
          <div class="align-self-center ml2">Загрузка</div>
        </w-flex>
      </template>
    </w-table>
  </w-card>

  <!--Диалоговое окно создания пользователя-->
  <w-dialog
      v-model="createUserDialog.show"
      :fullscreen="createUserDialog.fullscreen"
      :width="createUserDialog.width"
      :persistent="createUserDialog.persistent"
      :persistent-no-animation="createUserDialog.persistentNoAnimation"
      @close="createUserDialog.form.valid = null"
      title-class="primary-light1--bg black"
      >
    <template #title>
      <w-icon class="mr2">mdi mdi-pencil-outline</w-icon>
      Создать пользователя
    </template>

    <div class="message-box">
      <w-transition-fade>
        <w-alert
            v-if="createUserDialog.form.valid === false"
            error
            no-border
            class="my0 text-light">
          Имеются ошибки
        </w-alert>
      </w-transition-fade>
    </div>

    <w-form
        v-model="createUserDialog.form.valid"
        v-model:errors-count="createUserDialog.form.errorsCount"
        @validate="createUserFormOnValidate"
        @success="createUserFormOnSuccess"
        ref="createUserForm"
        class="my2 mx4"
        >

      <w-input v-model="createUserDialog.form.fields.name" :validators="[createUserDialog.form.validators.required]">ФИО</w-input>
      <w-input v-model="createUserDialog.form.fields.login" :validators="[createUserDialog.form.validators.required]">Логин</w-input>
      <w-input v-model="createUserDialog.form.fields.password" :validators="[createUserDialog.form.validators.required]">Пароль</w-input>
      <w-select
          v-model="createUserDialog.form.fields.role.value"
          :items="createUserDialog.form.fields.role.items"
          label="Роль"
          :validators="[createUserDialog.form.validators.required]"
          class="my4"
          :disabled="createUserDialog.form.fields.role.disable"
      ></w-select>
      <w-select
          v-model="createUserDialog.form.fields.department.value"
          :items="createUserDialog.form.fields.department.items"
          label="Отделение"
          :validators="[createUserDialog.form.validators.required]"
          class="my4"
      ></w-select>
      <w-input v-model="createUserDialog.form.fields.phone_number">Номер телефона</w-input>
      <w-input v-model="createUserDialog.form.fields.tg_chat_id">Telegram Chat ID</w-input>

    </w-form>

    <template #actions>
      <div class="spacer"/>
      <w-button
          @click="$refs.createUserForm.validate()"
          class="mr3"
          :loading="createUserDialog.form.buttonLoading"
      >
        Создать
      </w-button>
      <w-button @click="createUserDialog.show = false">Отмена</w-button>
    </template>
  </w-dialog>

  <!--Диалоговое окно редактирования пользователя-->
  <w-dialog
      v-model="editUserDialog.show"
      :fullscreen="editUserDialog.fullscreen"
      :width="editUserDialog.width"
      :persistent="editUserDialog.persistent"
      :persistent-no-animation="editUserDialog.persistentNoAnimation"
      @close="editUserDialog.form.valid = null"
      title-class="primary-light1--bg black"
  >
    <template #title>
      <w-icon class="mr2">mdi mdi-pencil-outline</w-icon>
      Редактирование пользователя
    </template>

    <div class="message-box">
      <w-transition-fade>
        <w-alert
            v-if="editUserDialog.form.valid === false"
            error
            no-border
            class="my0 text-light">
          Имеются ошибки
        </w-alert>
      </w-transition-fade>
    </div>

    <w-form
        v-model="editUserDialog.form.valid"
        v-model:errors-count="editUserDialog.form.errorsCount"
        @validate="editUserFormOnValidate"
        @success="editUserFormOnSuccess"
        ref="editUserForm"
        class="my2 mx4"
    >

      <w-input v-model="editUserDialog.user.name" :validators="[editUserDialog.form.validators.required]">ФИО</w-input>
      <w-input v-model="editUserDialog.user.login" :validators="[editUserDialog.form.validators.required]">Логин</w-input>
      <w-input v-model="editUserDialog.user.password" :validators="[editUserDialog.form.validators.required]">Пароль</w-input>
      <w-input v-model="editUserDialog.user.role" readonly>Роль</w-input>
      <w-input v-model="editUserDialog.user.department" readonly>Отделение</w-input>
<!--      <w-select
          v-model="editUserDialog.user.role"
          :items="editUserDialog.form.fields.role.items"
          label="Роль"
          :validators="[editUserDialog.form.validators.required]"
          class="my4"
          :disabled="editUserDialog.form.fields.role.disable"
      ></w-select>
      <w-select
          v-model="editUserDialog.user.department"
          :items="editUserDialog.form.fields.department.items"
          label="Отделение"
          :validators="[editUserDialog.form.validators.required]"
          class="my4"
      ></w-select>-->
      <w-input v-model="editUserDialog.user.phoneNumber">Номер телефона</w-input>
      <w-input v-model="editUserDialog.user.tgChatId">Telegram Chat ID</w-input>

    </w-form>

    <template #actions>
      <div class="spacer"/>
      <w-button
          bg-color="error"
          @click="deleteSelectedItem()">
        Удалить
      </w-button>
      <w-button
          @click="$refs.editUserForm.validate()"
          class="mx3"
          :loading="editUserDialog.form.buttonLoading"
      >
        Сохранить
      </w-button>
      <w-button @click="editUserDialog.show = false">Отмена</w-button>
    </template>
  </w-dialog>

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
      <w-checkbox v-if="$store.getters.getUserRole == 3" v-model="uploadUsersDialog.form.fields.rewrite" >Перезаписать <br><div class="caption">Полная очистка базы перед записью</div></w-checkbox>
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