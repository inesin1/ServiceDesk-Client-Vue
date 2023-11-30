<template>
  <s-header/>
    <w-flex grow>
      <s-aside class="sm-hide" v-if="userStore.isAuthenticated"/>
      <main class="grow">
        <router-view v-if="userStore.isAuthenticated"></router-view>
        <auth-view v-else/>
      </main>
    </w-flex>
  <footer>По вопросам работы сайта: +7 (908) 047 4215, Несин Артём Игоревич, Программист</footer>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
@import '@mdi/font/css/materialdesignicons.min.css';
.w-app {font-family: 'Ubuntu', sans-serif;}
</style>

<script>
import AuthView from "@/views/AuthView.vue";
import httpCommon from "@/http-common";
import SHeader from "@/components/SHeader.vue";
import SAside from "@/components/SAside.vue";
import {useUserStore} from "@/stores/user";
import {mapStores} from "pinia";
export default {
  computed: {
    ...mapStores(useUserStore)
  },
  components: {SAside, SHeader, AuthView},
  created() {
    httpCommon.updateOptions();
  }
}
</script>