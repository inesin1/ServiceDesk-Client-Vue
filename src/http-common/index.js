import axios from "axios";
import { useUserStore } from "@/stores/user";

let HTTP = axios.create();

export default {
  updateOptions() {
    HTTP = axios.create({
      baseURL: `http://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/`,
      headers: {
        Authorization: `Bearer ${useUserStore().user.token}`
      }
    });
  },
  
  // Авторизирует пользователя
  auth(authData) {
    return HTTP.post('auth', authData).then(res => res.data)
  },
  
  // Возвращает заявки
  getTickets(offset, limit, filter) {
    return HTTP.get(
        'tickets',
        {
          params: {
                offset: offset,
                limit: limit,
                ...filter
          }
        })
        .then(res => res.data);
  },

  // Возвращает количество заявок
  getTicketsCount() {
    return HTTP.get(`tickets/count`).then(res => res.data)
  },

  // Возвращает заявку по id
  getTicket(id) {
    return HTTP.get(`tickets/${id}`).then(res => res.data);
  },
  
  // Создает новую заявку
  // ticket: { categoryId, details }
  createTicket(ticket) {
    return HTTP.post(`tickets`, ticket).then(res => res.data);
  },
  
  // Устанавливает исполнителя и меняет статус на "В работе"
  // ticketId - id заявки
  // executorId - id исполнителя
  putTicketToWork(ticketId, executorId) {
    return HTTP.put(`tickets/${ticketId}/work/${executorId}`).then(res => res.data);
  },

  // Закрывает заявку
  closeTicket(ticketId) {
    return HTTP.put(`tickets/${ticketId}/close`).then(res => res.data);
  },

  // Возвращает статусы заявки
  getTicketStatuses() {
    return HTTP.get(`tickets/statuses`).then(res => res.data);
  },

  // Возвращает статус заявки
  getTicketStatus(id) {
    return HTTP.get(`tickets/statuses/${id}`).then(res => res.data);
  },

  // Создает статус заявки
  postTicketStatus(status) {
    return HTTP.post(`tickets/statuses`, status).then(res => res.data);
  },

  // Удаляет статус заявки
  deleteTicketStatus(id) {
    return HTTP.delete(`tickets/statuses/${id}`).then(res => res.data);
  },

  // Возвращает источники заявки
  getTicketSources() {
    return HTTP.get(`tickets/sources`).then(res => res.data);
  },

  // Возвращает источник заявки
  getTicketSource(id) {
    return HTTP.get(`tickets/sources/${id}`).then(res => res.data);
  },

  // Создает источник заявки
  postTicketSource(source) {
    return HTTP.post(`tickets/sources`, source).then(res => res.data);
  },

  // Удаляет источник заявки
  deleteTicketSource(id) {
    return HTTP.delete(`tickets/sources/${id}`).then(res => res.data);
  },

/*  // Возвращает приоритеты
  getPriorities() {
    return HTTP.get(`priorities`).then(res => res.data);
  },

  // Возвращает приоритет по id
  getPriority(id) {
    return HTTP.get(`priorities/${id}`).then(res => res.data);
  },

  // Создает приоритет
  postPriority(priority) {
    return HTTP.post(`priorities`, priority).then(res => res.data);
  },

  // Удаляет приоритет по id
  deletePriority(id) {
    return HTTP.delete(`priorities/${id}`).then(res => res.data);
  },*/

  // Возвращает пользователей
  getUsers(_with, offset, limit) {
    return HTTP.get(
        'users',
        {
          params: {
            offset: offset,
            limit: limit,
            with: _with
          }
        })
        .then(res => res.data);
  },

  // Возвращает пользователя по id
  getUser(id, _with) {
    return HTTP.get(
        `users/${id}`,
        {
          params: {
            with: _with
          }
        })
        .then(res => res.data);
  },

  // Возвращает текущего пользователя
  getCurrentUser() {
    return HTTP.get(`users/current`).then(res => res.data);
  },

  // Возвращает ИТ-специалистов и администраторов
  getUsersIT() {
    return HTTP.get(`users/specialists`).then(res => res.data);
  },

  // Проверяет доступность логина
  checkLoginAvailable(login) {
    return HTTP.get(`users/checklogin/${login}`).then(res => res.data)
  },

  // Создает пользователя
  createUser(user) {
    return HTTP.post(`users`, user)
  },

  // Редактирует пользователя
  putUser(id, user) {
    return HTTP.put(`users/${id}`, user).then(res => res.data)
  },

  // Меняет пароль пользователю
  changeUserPassword(id, password) {
    return HTTP.put(`users/${id}/changePassword`, password).then(res => res.data)
  },

  // Загружает пользоваталей из файла
  uploadUsers(file, rewrite) {
    const formData = new FormData()
    formData.append('file', file[0].file)
    return HTTP.post(`users/upload?rewrite=${rewrite}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  // Удаляет пользователя
  deleteUser(id) {
    return HTTP.delete(`users/${id}`).then(res => res.data);
  },

  // Возвращает роли
  getUserRoles() {
    return HTTP.get(`users/roles`).then(res => res.data);
  },

  // Возвращает роль по id
  getUserRole(id) {
    return HTTP.get(`users/roles/${id}`).then(res => res.data);
  },

  // Создает роль
  createUserRole(role) {
    return HTTP.post(`users/roles`, role).then(res => res.data);
  },

  // Удаляет роль
  deleteUserRole(id) {
    return HTTP.delete(`users/roles/${id}`).then(res => res.data);
  },

// deprecated
/*  // Возвращает подразделения
  getDivisions() {
    return HTTP.get(`divisions`).then(res => res.data);
  },

  // Возвращает подразделение по id
  getDivision(id) {
    return HTTP.get(`divisions/${id}`).then(res => res.data);
  },

  // Создает подразделение
  postDivision(division) {
    return HTTP.post(`divisions`, division).then(res => res.data);
  },

  // Удаляет подразделение по id
  deleteDivision(id) {
    return HTTP.delete(`divisions/${id}`).then(res => res.data);
  },*/

  // Возвращает отделения
  getDepartments() {
    return HTTP.get(`departments`).then(res => res.data);
  },

  // Возвращает отделение по id
  getDepartment(id) {
    return HTTP.get(`departments/${id}`).then(res => res.data);
  },

  // Создает отделение
  createDepartment(department) {
    return HTTP.post(`departments`, department).then(res => res.data);
  },

  // Удаляет отделение
  deleteDepartment(id) {
    return HTTP.delete(`departments/${id}`).then(res => res.data);
  },
  
  // Возвращает категории проблем
  getTicketCategories() {
    return HTTP.get(`tickets/categories`).then(res => res.data);
  },
  
  // Возвращает категорию проблемы по id
  getTicketCategory(id) {
    return HTTP.get(`tickets/categories/${id}`).then(res => res.data);
  },

  // Создает категорию проблемы
  createTicketCategory(ticketCategory) {
    return HTTP.post(`tickets/categories`, ticketCategory).then(res => res.data);
  },

  // Удаляет категорию проблемы
  deleteTicketCategory(id) {
    return HTTP.delete(`tickets/categories/${id}`).then(res => res.data);
  },

  // Возвращает комментарии к заявке
  getTicketComments(ticketId) {
    return HTTP.get(`tickets/${ticketId}/comments`).then(res => res.data);
  },

  // Создает комментарий
  createTicketComment(ticketId, comment) {
    return HTTP.post(`tickets/${ticketId}/comments`, comment).then(res => res.data);
  }
}
