<template>
    <w-card
        :title="'Пользователь ID: ' + this.user.id"
        bg-color="grey-dark6"
        class="ma4">
        
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
      }
    })
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
        console.log(this.user)
      })
  }
}
</script>

<style scoped>

</style>