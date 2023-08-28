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
            <w-button v-if="isEdit" @click="saveChanges" bg-color="success" >Сохранить</w-button>
            <w-button v-if="isEdit" @click="cancelChanges" bg-color="error" >Отмена</w-button>
          </w-flex>

          <w-input label="Имя" :readonly="!isEdit" label-position="left" v-model="user.name"/>
          <w-input label="Роль" readonly label-position="left" v-model="user.role.name"/>
          <w-input label="Отделение" readonly label-position="left" v-model="user.department.name"/>
          <w-input label="Номер телефона" :readonly="!isEdit" label-position="left" v-model="user.phoneNumber"/>
          <w-input label="Telegram ChatId" v-if="user.role.id != 1" :readonly="!isEdit" label-position="left" :model-value="user.tgChatId"/>
          <!--<w-input label="Дополнительная информация" readonly label-position="left"/>-->
        </w-flex>
      </w-flex>

    </w-card>
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
      isEdit: false
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
    }
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