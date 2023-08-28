import { createRouter, createWebHistory } from 'vue-router'
import TicketsView from "@/views/TicketsView.vue";
import TicketIdView from "@/views/TicketIdView.vue";
import ProfileView from "@/views/ProfileView.vue";
import UsersView from "@/views/UsersView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ReportsView from "@/views/ReportsView.vue";
import ContactsView from "@/views/ContactsView.vue";
import NewsView from "@/views/NewsView.vue";

const routes = [
  { path: '/news', name: 'news', component: NewsView },
  { path: '/tickets', name: 'tickets', component: TicketsView },
  { path: '/ticket/:id', name: 'ticketId', component: TicketIdView },
  { path: '/profile/:id', name: 'profile', component: ProfileView },
  { path: '/users', name: 'users', component: UsersView },
  { path: '/settings', name: 'settings', component: SettingsView },
  { path: '/reports', name: 'reports', component: ReportsView },
  { path: '/contacts', name: 'contacts', component: ContactsView },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
