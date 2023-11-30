<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user";

export default defineComponent({
  name: "SEditUserDialog",
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    },
    persistent: {
      type: Boolean,
      default: false
    },
    persistentNoAnimation: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 1000
    },
    userId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    form: {
      valid: null,
      submitted: false,
      sent: false,
      errorsCount: 0,
      validators: {
        required: value => !!value || 'Поле обязательно для заполнения!',
        loginAvailable: async value => (await httpCommon.checkLoginAvailable(value)) === 'ok' || 'Логин занят'
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
        departments: {
          value: [],
          items: []
        },
        phone: '',
        tg_chat_id: ''
      }
    }
  }),
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    // Вызывается при успешной проверке формы редактирования
    async onSuccess() {
      try {
        this.form.buttonLoading = true;
        this.form.sent = true

        const response = await httpCommon.putUser(this.userId, {
          name: this.form.fields.name,
          login: this.form.fields.login,
          password: this.form.fields.password,
          roleId: this.form.fields.role.value,
          departmentIds: this.form.fields.departments.value,
          phone: this.form.fields.phone,
          tgChatId: this.form.fields.tg_chat_id,
        })

        console.log(response)

        this.$waveui.notify('Пользователь успешно отредактирован!', 'success');
        this.$emit('loadUsers')
        this.$emit('close')
      } catch (e) {
        console.log('При редактировании пользователя произошла ошибка: ' + e.message)
        this.$waveui.notify('При редактировании пользователя произошла ошибка: ' + e.message, 'error')
      } finally {
        this.form.buttonLoading = false
      }
    },

    // Вызывается при проверке полей формы редактирования
    onValidate () {
      this.form.sent = false
      this.form.submitted = this.form.errorsCount === 0
    },

    // Удаляет запись
    async deleteUser() {
      try {
        const response = await httpCommon.deleteUser(this.userId)
        console.log(response)
        this.$waveui.notify('Пользователь успешно удален!', 'success');
        this.$emit('loadUsers')
        this.$emit('close')
      } catch (e) {
        console.log('При создании пользователя произошла ошибка: ' + e.message)
        this.$waveui.notify('При редактировании пользователя произошла ошибка: ' + e.message, 'error')
      }
    },
  },
  async created() {
    const user = await httpCommon.getUser(this.userId, "departments");
    this.form.fields = {
      name: user.name,
      login: user.login,
      password: user.password,
      role: {
        value: user.role.id,
        items: [],
        disable: true
      },
      departments: {
        value: user.departments.map(d => d.id),
        items: []
      },
      phone: user.phone,
      tg_chat_id: user.tgChatId
    }

    // load user roles
    const userRoles = await httpCommon.getUserRoles()
    this.form.fields.role.items = userRoles.map(userRole => {
      return {
        label: userRole.name,
        value: userRole.id
      }
    })

    // load departments
    const departments = await httpCommon.getDepartments()
    this.form.fields.departments.items = departments.map(department => {
      return {
        label: department.name,
        value: department.id
      }
    })

    if (this.userStore.user.role.id === 3) {
      this.form.fields.role.disable = false;
    }
  }
})
</script>

<template>
  <w-dialog
      :fullscreen="fullscreen"
      :width="width"
      :persistent="persistent"
      :persistent-no-animation="persistentNoAnimation"
      @close="form.valid = null"
      title-class="primary-light1--bg black"
  >
    <template #title>
      <w-icon class="mr2">mdi mdi-pencil-outline</w-icon>
      Редактирование пользователя
    </template>

    <div class="message-box">
      <w-transition-fade>
        <w-alert
            v-if="form.valid === false"
            error
            no-border
            class="my0 text-light">
          Имеются ошибки
        </w-alert>
      </w-transition-fade>
    </div>

    <w-form
        v-model="form.valid"
        v-model:errors-count="form.errorsCount"
        @validate="onValidate"
        @success="onSuccess"
        ref="editUserForm"
        class="my2 mx4"
    >

      <w-input v-model="form.fields.name" :validators="[form.validators.required]">ФИО</w-input>
      <w-input v-model="form.fields.login" readonly>Логин</w-input>
      <w-input v-model="form.fields.password" :validators="[form.validators.required]">Пароль</w-input>
      <w-select
          v-model="form.fields.role.value"
          :items="form.fields.role.items"
          label="Роль"
          :validators="[form.validators.required]"
          class="my4"
          :disabled="form.fields.role.disable"
      ></w-select>
      <w-select
          v-model="form.fields.departments.value"
          :items="form.fields.departments.items"
          multiple
          label="Отделения"
          :validators="[form.validators.required]"
          class="my4"
      ></w-select>
      <w-input v-model="form.fields.phone">Номер телефона</w-input>
      <w-input v-model="form.fields.tgChatId">Telegram Chat ID</w-input>

    </w-form>

    <template #actions>
      <div class="spacer"/>
      <w-button
          bg-color="error"
          @click="deleteUser()">
        Удалить
      </w-button>
      <w-button
          @click="$refs.editUserForm.validate()"
          class="mx3"
          :loading="form.buttonLoading"
      >
        Сохранить
      </w-button>
      <w-button @click="$emit('close')">Отмена</w-button>
    </template>
  </w-dialog>
</template>

<style scoped>

</style>