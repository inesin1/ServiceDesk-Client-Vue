<template>
    <w-card
        shadow
        class="ma8"
        content-class="pa0">
        <div class="message-box">
            <w-transition-fade>
                <w-alert
                  v-if="form.submitted"
                  success
                  no-border
                  class="my0 text-light">
                    Вход выполнен успешно!
                </w-alert>
                
                <w-alert
                  v-else-if="form.valid === false"
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
            class="px8 pt2 pb6">

            <w-input
                    v-model="authData.login"
                    required
                    label="Логин"
                    inner-icon-left="mdi mdi-account"
                    :validators="[validators.required]">
            </w-input>

            <w-input
                    v-model="authData.password"
                    required
                    label="Пароль"
                    :type="isPassword ? 'password' : 'text'"
                    :inner-icon-left="isPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
                    @click:inner-icon-left="isPassword = !isPassword"
                    :validators="[validators.required]"
                    class="mt3">
            </w-input>

            <w-button
                    type="submit"
                    :disabled="form.valid === false"
                    :loading="form.submitted && !form.sent"
                    class="mt6">
                Войти
            </w-button>
        </w-form>
    </w-card>
</template>

<script>
import store from "@/store";
import http from "@/http-common";

export default {
  name: "AuthView",
  data: () => ({
    form: {
      valid: null,
      submitted: false,
      sent: false,
      errorsCount: 0
    },
    validators: {
      required: value => !!value || 'Поле обязательно для заполнения',
    },
    isPassword: true,
    authData: {
      login: '',
      password: ''
    }
  }),
  
  methods: {
    onSuccess () {
      setTimeout(() => (this.form.sent = true), 2000);
        http.postAuth(this.authData)
            .then(response => {store.commit('setUser', response.data); http.updateOptions()});
    },
    onValidate () {
      this.form.sent = false
      this.form.submitted = this.form.errorsCount === 0
    }
  }
}
</script>

<style scoped>
.message-box {min-height: 35px;}
</style>