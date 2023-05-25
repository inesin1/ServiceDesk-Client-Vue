import axios from "axios";
import store from "@/store";

let HTTP = axios.create();

export default {
  updateOptions() {
    HTTP = axios.create({
      baseURL: `http://94.24.237.230:7171/api/`,
      headers: {
        Authorization: `Bearer ${store.state.user.token}`
      }
    });
  },
  
  // Авторизирует пользователя
  postAuth(authData) {
    return HTTP.post('auth', authData).then(res => res.data)
  },
  
  // Возвращает заявки
  getTickets() {
    return HTTP.get('tickets').then(res => res.data);
  },
  
  // Возвращщает заявку по id
  getTicket(id) {
    return HTTP.get(`tickets/${id}`).then(res => res.data);
  },
  
  // Создает новую заявку
  // ticket: { subject, text }
  postTicket(ticket) {
    return HTTP.post(`tickets`, ticket).then(res => res.data);
  },
  
  // Устанавливает исполнителя и меняет статус на "В работе"
  // ticketId - id заявки
  // executorId - id исполнителя
  putTicket(ticketId, executorId) {
    return HTTP.put(`tickets/${ticketId}/work/${executorId}`).then(res => res.data);
  },
  
  closeTicket(ticketId) {
    return HTTP.put(`tickets/${ticketId}/close`).then(res => res.data);
  },

  // Возвращает статусы
  getStatuses() {
    return HTTP.get(`statuses`).then(res => res.data);
  },

  // Возвращает статус по id
  getStatus(id) {
    return HTTP.get(`statuses/${id}`).then(res => res.data);
  },

  // Возвращает приоритеты
  getPriorities() {
    return HTTP.get(`priorities`).then(res => res.data);
  },

  // Возвращает приоритет по id
  getPriority(id) {
    return HTTP.get(`priorities/${id}`).then(res => res.data);
  },

  // Возвращает пользователей
  getUsers() {
    return HTTP.get('users').then(res => res.data);
  },

  // Возвращает пользователя по id
  getUser(id) {
    return HTTP.get(`users/${id}`).then(res => res.data);
  },

  // Возвращает текущего пользователя
  getUserCurrent() {
    return HTTP.get(`users/current`).then(res => res.data);
  },

  // Возвращает роли
  getRoles() {
    return HTTP.get(`roles`).then(res => res.data);
  },

  // Возвращает роль по id
  getRole(id) {
    return HTTP.get(`roles/${id}`).then(res => res.data);
  },

  // Возвращает подразделения
  getDivisions() {
    return HTTP.get(`divisions`).then(res => res.data);
  },

  // Возвращает подразделение по id
  getDivision(id) {
    return HTTP.get(`divisions/${id}`).then(res => res.data);
  },

  // Возвращает отделения
  getDepartments() {
    return HTTP.get(`departments`).then(res => res.data);
  },

  // Возвращает отделение по id
  getDepartment(id) {
    return HTTP.get(`departments/${id}`).then(res => res.data);
  },
  
  // Возвращает категории проблем
  getProblemCategories() {
    return HTTP.get(`problemCategories`).then(res => res.data);
  },
  
  // Возвращает категорию проблемы по id
  getProblemCategory(id) {
    return HTTP.get(`problemCategories/${id}`).then(res => res.data);
  }
}
