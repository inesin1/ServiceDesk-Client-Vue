<template>
    <w-card
        :title="'Пользователь ID: ' + this.user.id"
        bg-color="base-bg-color"
        class="ma4">
      <w-flex row align-start>
        <w-flex column class="xs3">
          <div class="ma4 bdrs4 w-flex justify-center" style="background: aliceblue">
            <w-image :src="require('../assets/user.png')" :ratio="1"/>
          </div>
          <w-button disabled>Загрузить фото</w-button>
        </w-flex>

        <w-flex class="xs9 ma4" column gap="8">
          <w-flex row gap="4" class="align-self-start" v-if="$store.getters.getUserRole == 3 || user.id == $store.getters.getCurrentUser.id">
            <w-button v-if="!isEdit" @click="openEdit" >Редактировать</w-button>
            <w-button v-if="!isEdit" @click="openPasswordChangeDialog" >Сменить пароль</w-button>
            <w-button v-if="isEdit" @click="saveChanges" bg-color="success" >Сохранить</w-button>
            <w-button v-if="isEdit" @click="cancelChanges" bg-color="error" >Отмена</w-button>
          </w-flex>

          <w-input label="Имя" :readonly="!isEdit" label-position="left" v-model="user.name"/>
          <w-input label="Роль" readonly label-position="left" v-model="user.role.name"/>
          <w-input label="Отделение" readonly label-position="left" v-model="user.department.name"/>
          <w-input label="Номер телефона" :readonly="!isEdit" label-position="left" v-model="user.phoneNumber"/>
          <w-input label="Telegram ChatId" v-if="user.role.id != 1" :readonly="!isEdit" label-position="left" v-model="user.tgChatId"/>
          <!--<w-input label="Дополнительная информация" readonly label-position="left"/>-->
        </w-flex>
      </w-flex>

    </w-card>

  <w-dialog
    v-model="passwordChangeDialog.show"
    :width="passwordChangeDialog.width"
    @close="passwordChangeDialog.form.valid = null"
    title-class="primary-light1--bg black"
  >
    <template #title>
      <w-icon class="mr2">mdi mdi-pencil-outline</w-icon>
      Сменить пароль
    </template>

    <div class="message-box">
      <w-transition-fade>
        <w-alert
            v-if="passwordChangeDialog.form.valid === false"
            error
            no-border
            class="my0 text-light">
          Имеются ошибки
        </w-alert>
      </w-transition-fade>
    </div>

    <w-form
        v-model="passwordChangeDialog.form.valid"
        v-model:errors-count="passwordChangeDialog.form.errorsCount"
        @validate="passwordChangeFormOnValidate"
        @success="passwordChangeFormOnSuccess"
        ref="passwordChangeForm"
        class="my2 mx4"
    >

      <div class="caption mb2">
        Требования к паролю:
        <li>Только английские буквы</li>
        <li>Минимум 8 символов</li>
        <li>Минимум 1 заглавная буква</li>
        <li>Минимум 1 прописная буква</li>
        <li>Минимум 1 цифра</li>
      </div>

      <w-input v-model="passwordChangeDialog.form.newPassword" :validators="[passwordChangeDialog.form.validators.required, passwordChangeDialog.form.validators.correct]">Новый пароль</w-input>
    </w-form>

    <template #actions>
      <div class="spacer"/>
      <w-button
          @click="$refs.passwordChangeForm.validate()"
          class="mx3"
      >
        Применить
      </w-button>
      <w-button @click="passwordChangeDialog.show = false">Отмена</w-button>
    </template>
  </w-dialog>
</template>

<script>
import httpCommon from "@/http-common";

export default {
  name: "ProfileView",
  data: function () {
    return ({
      user: {
        id: this.$route.params.id,
        name: null,
        role: null,
        department: null,
        phoneNumber: null,
        tgChatId: null
      },
      isEdit: false,

      passwordChangeDialog: {
        show: false,
        width: 1000,

        form: {
          valid: null,
          submitted: false,
          sent: false,
          errorsCount: 0,
          validators: {
            required: value => !!value || 'Поле обязательно для заполнения',
            correct: value => new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(value) || 'Пароль не соответствует требованиям'
          },

          newPassword: '',
        }
      }
    })
  },

  methods: {
    openEdit() {
      this.isEdit = true;
    },
    saveChanges() {
      this.isEdit = false;

      httpCommon.putUser(this.user.id, {
        name: this.user.name,
        login: this.user.login,
        password: this.user.password,
        roleId: this.user.role.id,
        departmentId: this.user.department.id,
        phoneNumber: this.user.phoneNumber,
        tgChatId: this.user.tgChatId,
      })
          .then(response => {
            this.$waveui.notify('Профиль обновлен', 'success');
          })
          .catch(error => this.$waveui.notify('При редактировании пользователя произошла ошибка: ' + error.message, 'error'))
    },
    cancelChanges() {
      this.isEdit = false;
    },
    openPasswordChangeDialog() {
      this.passwordChangeDialog.show = true;
    },
    // Вызывается при проверке полей формы смены пароля
    passwordChangeFormOnValidate () {
      this.passwordChangeDialog.form.sent = false;
      this.passwordChangeDialog.form.submitted = this.passwordChangeDialog.form.errorsCount === 0;
    },

    // Вызывается при успешной проверке формы смены пароля
    passwordChangeFormOnSuccess () {
      this.passwordChangeDialog.form.sent = true;

      httpCommon.changeUserPassword(this.user.id, this.passwordChangeDialog.form.newPassword)
          .then(
              data => {this.$waveui.notify('Пароль успешно изменён, пожалуйста, не забудьте его!', 'success', 0); this.passwordChangeDialog.show = false},
              error => this.$waveui.notify(`Возникла ошибка: ${error}`, 'error', 0)
          )
    },
  },
  
  // Инициализация
  created() {
    httpCommon.getUser(this.user.id)
      .then(async user => {
        Object.assign(
          this.user,
          user,
          {role: await httpCommon.getRole(user.roleId)},
          {department: await httpCommon.getDepartment(user.departmentId)},
        );
      })
  }
}
</script>

<style scoped>

</style>