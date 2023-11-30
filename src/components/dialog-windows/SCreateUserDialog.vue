<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";
import {useUserStore} from "@/stores/user";
import {mapStores} from "pinia";

export default defineComponent({
  name: "SCreateUserDialog",
  props: {
    show: {
      type: Boolean,
      default: false
    },
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
          value: 1,
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
    // Вызывается при успешной проверке формы создания
    async onSuccess() {
      try {
        this.form.buttonLoading = true;
        this.form.sent = true

        const response = await httpCommon.createUser({
          name: this.form.fields.name,
          login: this.form.fields.login,
          password: this.form.fields.password,
          roleId: this.form.fields.role.value,
          departmentIds: this.form.fields.departments.value,
          phone: this.form.fields.phone,
          tgChatId: this.form.fields.tg_chat_id,
        })

        console.log(response)

        this.$waveui.notify('Пользователь успешно создан!', 'success');
        this.$emit('loadUsers')
        this.$emit('close')
      } catch(e) {
        console.log('При создании пользователя произошла ошибка: ' + e.message)
        this.$waveui.notify('При создании пользователя произошла ошибка: ' + e.message, 'error')
      } finally {
        this.form.buttonLoading = false
      }
    },

    // Вызывается при проверке полей формы создания
    onValidate () {
      this.form.sent = false
      this.form.submitted = this.form.errorsCount === 0
    },
  },
  async created() {
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
      :model-value="show"
      :fullscreen="fullscreen"
      :width="width"
      :persistent="persistent"
      :persistent-no-animation="persistentNoAnimation"
      @close="form.valid = null"
      title-class="primary-light1--bg black"
  >
    <template #title>
      <w-icon class="mr2">mdi mdi-pencil-outline</w-icon>
      Создать пользователя
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
        ref="form"
        class="my2 mx4"
    >

      <w-input v-model="form.fields.name" :validators="[form.validators.required]">ФИО</w-input>
      <w-input v-model="form.fields.login" :validators="[form.validators.required, form.validators.loginAvailable]">Логин</w-input>
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
      <w-input v-model="form.fields.tg_chat_id">Telegram Chat ID</w-input>

    </w-form>

    <template #actions>
      <div class="spacer"/>
      <w-button
          @click="$refs.form.validate()"
          class="mr3"
          :loading="form.buttonLoading"
      >
        Создать
      </w-button>
      <w-button @click="this.$emit('close')">Отмена</w-button>
    </template>
  </w-dialog>
</template>

<style scoped>

</style>