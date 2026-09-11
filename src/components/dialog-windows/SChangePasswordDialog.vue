<script>
import { defineComponent } from 'vue'
import httpCommon from '@/http-common'

export default defineComponent({
  name: 'SChangePasswordDialog',
  props: {
    fullscreen: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    persistentNoAnimation: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 1000,
    },
  },
  data: () => ({
    form: {
      valid: null,
      submitted: false,
      sent: false,
      errorsCount: 0,
      validators: {
        required: (value) => !!value || 'Поле обязательно для заполнения',
        correct: (value) =>
          new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(value) ||
          'Пароль не соответствует требованиям',
      },

      newPassword: '',
    },
  }),
  methods: {
    // Вызывается при проверке полей формы смены пароля
    onValidate() {
      this.form.sent = false
      this.form.submitted = this.form.errorsCount === 0
    },

    // Вызывается при успешной проверке формы смены пароля
    onSuccess() {
      this.form.sent = true

      httpCommon.changeUserPassword(this.user.id, this.form.newPassword).then(
        () => {
          this.$waveui.notify('Пароль успешно изменён, пожалуйста, не забудьте его!', 'success', 0)
          this.passwordChangeDialog.show = false
        },
        (error) => this.$waveui.notify(`Возникла ошибка: ${error}`, 'error', 0),
      )
    },
  },
})
</script>

<template>
  <w-dialog :width="width" title-class="primary-light1--bg black" @close="form.valid = null">
    <template #title>
      <w-icon class="mr2"> mdi mdi-pencil-outline </w-icon>
      Сменить пароль
    </template>

    <div class="message-box">
      <w-transition-fade>
        <w-alert v-if="form.valid === false" error no-border class="my0 text-light">
          Имеются ошибки
        </w-alert>
      </w-transition-fade>
    </div>

    <w-form
      ref="passwordChangeForm"
      v-model="form.valid"
      v-model:errors-count="form.errorsCount"
      class="my2 mx4"
      @validate="onValidate"
      @success="onSuccess"
    >
      <div class="caption mb2">
        Требования к паролю:
        <li>Только английские буквы</li>
        <li>Минимум 8 символов</li>
        <li>Минимум 1 заглавная буква</li>
        <li>Минимум 1 прописная буква</li>
        <li>Минимум 1 цифра</li>
      </div>

      <w-input
        v-model="form.newPassword"
        :validators="[form.validators.required, form.validators.correct]"
      >
        Новый пароль
      </w-input>
    </w-form>

    <template #actions>
      <div class="spacer" />
      <w-button class="mx3" @click="$refs.passwordChangeForm.validate()"> Применить </w-button>
      <w-button @click="$emit('close')"> Отмена </w-button>
    </template>
  </w-dialog>
</template>

<style scoped></style>
