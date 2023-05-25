<template>
    <s-header/>
    <w-flex grow>
        <s-aside class="sm-hide"/>
        <main class="grow">
            <router-view v-if="$store.getters.isAuthenticated"></router-view>
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
import store from "@/store";
import httpCommon from "@/http-common";
export default {
  data: () => ({
  
  }),
  components: {AuthView},
  created() {
    store.commit('setUser', {id:1, name: 'admin', role: 3, token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJteUFwcCIsImlzcyI6Im15QXBwIiwiaWQiOjF9.CABQOGsBBVAnJPMgbh4rdahnUVZFV6iZUY7tN7uzs1U'});
    httpCommon.updateOptions();
  }
}
</script>