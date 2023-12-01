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
          <w-flex row gap="4" class="align-self-start" v-if="userStore.user.role.id === 3 || user.id === userStore.user.id">
            <w-button v-if="!isEdit" @click="openEdit" >Редактировать</w-button>
            <w-button v-if="!isEdit" @click="openPasswordChangeDialog" >Сменить пароль</w-button>
            <w-button v-if="isEdit" @click="saveChanges" bg-color="success" :loading="form.buttonLoading">Сохранить</w-button>
            <w-button v-if="isEdit" @click="cancelChanges" bg-color="error" >Отмена</w-button>
          </w-flex>

          <w-form
              v-model="form.valid"
              v-model:errors-count="form.errorsCount"
              @validate="editFormOnValidate"
              @success="editFormOnSuccess"
              ref="editForm"
              class="w-flex column gap4"
          >
            <w-input label="Имя" :readonly="!isEdit" label-position="left" v-model="user.name"/>
            <w-select
                v-model="user.role.id"
                :items="form.fields.roles"
                label="Роль"
                label-position="left"
                :validators="[form.validators.required]"
                readonly
            ></w-select>
            <w-select
                v-model="user.departments"
                :items="form.fields.departments"
                multiple
                label="Отделения"
                label-position="left"
                :validators="[form.validators.required]"
                :readonly="!isEdit"
            ></w-select>
            <w-input label="Номер телефона" :readonly="!isEdit" label-position="left" v-model="user.phone"/>
            <w-input label="Telegram ChatId" v-if="user.role.id !== 1" :readonly="!isEdit" label-position="left" v-model="user.tgChatId"/>
          </w-form>
        </w-flex>
      </w-flex>
    </w-card>

  <s-change-password-dialog
      v-if="passwordChangeDialog.show"
      @close="passwordChangeDialog.show = false"
  />
</template>

<script>
import httpCommon from "@/http-common";
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user";
import SChangePasswordDialog from "@/components/dialog-windows/SChangePasswordDialog.vue";
import SCreateTicketDialog from "@/components/dialog-windows/SCreateTicketDialog.vue";

export default {
  name: "ProfileView",
  components: {SCreateTicketDialog, SChangePasswordDialog},
  data: () => ({
    user: {
      id: null,
      name: null,
      role: {id: 1},
      departments: null,
      phone: null,
      tgChatId: null
    },
    isEdit: false,

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
        roles: [],
        departments: []
      }
    },

    passwordChangeDialog: {
      show: false
    }
  }),
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    openEdit() {
      this.isEdit = true;
    },
    async saveChanges() {
      this.$refs.editForm.validate()
    },
    cancelChanges() {
      this.isEdit = false;
    },
    openPasswordChangeDialog() {
      this.passwordChangeDialog.show = true;
    },

    editFormOnValidate() {
      this.form.sent = false
      this.form.submitted = this.form.errorsCount === 0
    },
    async editFormOnSuccess() {
      try {
        this.isEdit = false;

        const response = await httpCommon.putUser(this.user.id, {
          name: this.user.name,
          login: this.user.login,
          password: this.user.password,
          roleId: this.user.role.id,
          departmentIds: this.user.departments,
          phone: this.user.phone,
          tgChatId: this.user.tgChatId,
        })

        console.log(response)

        this.$waveui.notify('Профиль обновлен', 'success');
      } catch (e) {
        console.log('Произошла ошибка: ' + e.message)
        this.$waveui.notify(`Произошла ошибка: ${e.message}`, 'error')
      }
    }
  },

  async created() {
    try {
      const userId = this.$route.params.id
      this.user = await httpCommon.getUser(userId, "departments")
      this.user.departments = this.user.departments.map(d => d.id)

      // load user roles
      const userRoles = await httpCommon.getUserRoles()
      this.form.fields.roles = userRoles.map(userRole => {
        return {
          label: userRole.name,
          value: userRole.id
        }
      })

      // load departments
      const departments = await httpCommon.getDepartments()
      this.form.fields.departments = departments.map(department => {
        return {
          label: department.name,
          value: department.id
        }
      })
    } catch (e) {
      console.log('Произошла ошибка: ' + e.message)
      this.$waveui.notify(`Произошла ошибка: ${e.message}`, 'error')
    }
  }
}
</script>

<style scoped>

</style>