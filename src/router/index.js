import { createRouter, createWebHistory } from 'vue-router'
import TicketsView from "@/views/TicketsView.vue";
import TicketIdView from "@/views/TicketIdView.vue";
import ProfileView from "@/views/ProfileView.vue";

const routes = [
  { path: '/tickets', name: 'tickets', component: TicketsView },
  { path: '/ticket/:id', name: 'ticketId', component: TicketIdView },
  { path: '/profile/:id', name: 'profile', component: ProfileView },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
