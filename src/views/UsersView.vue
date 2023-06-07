<script>
import {defineComponent} from 'vue'
import {create} from "axios";
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
            value: '',
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
    }
  }),
  methods: {
    create,
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

    // Обрабатывает событие выбора пользователя
    rowSelection(event) {
      this.table.selection = event.item;
      this.table.deleteButtonDisable = false;
    },

    // Удаляет выбранную запись
    deleteSelectedItem() {
      httpCommon.deleteUser(this.table.selection.id)
    },

    // Вызывается при успешной проверке формы
    onSuccess () {
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

    // Вызывается при проверке полей формы
    onValidate () {
      this.createUserDialog.form.sent = false
      this.createUserDialog.form.submitted = this.createUserDialog.form.errorsCount === 0
    },
  },
  created() {
    this.loadUsers();

    if (store.getters.getUserRole == 3)
      this.createUserDialog.form.fields.role.disable = false;
  }
})
</script>

<template>
  <w-card
      title="Пользователи"
      bg-color="grey-dark6"
      class="ma4">

    <w-flex row class="gap2">
      <w-button
          bg-color="success"
          class="mb4"
          @click="openCreateUserDialog">
        Создать
      </w-button>
      <w-button
          bg-color="error"
          class="mb4"
          @click="deleteSelectedItem()"
          :disabled="table.deleteButtonDisable">
        Удалить
      </w-button>
    </w-flex>

    <w-table
        :headers="table.headers"
        :items="table.items"
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
        @validate="onValidate"
        @success="onSuccess"
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
      <w-input v-model="createUserDialog.form.fields.phone_number" :validators="[createUserDialog.form.validators.required]">Номер телефона</w-input>
      <w-input v-model="createUserDialog.form.fields.tg_chat_id" :validators="[createUserDialog.form.validators.required]">Telegram Chat ID</w-input>

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

</template>

<style scoped>

</style>