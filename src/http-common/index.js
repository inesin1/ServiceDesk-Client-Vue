import axios from "axios";
import store from "@/store";

let HTTP = axios.create();

export default {
  updateOptions() {
    HTTP = axios.create({
      baseURL: `http://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/`,
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

  // Создает статус
  postStatus(status) {
    return HTTP.post(`statuses`, status).then(res => res.data);
  },

  // Удаляет статус по id
  deleteStatus(id) {
    return HTTP.delete(`statuses/${id}`).then(res => res.data);
  },

  // Возвращает приоритеты
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

  // Возвращает ИТ-специалистов и администраторов
  getUsersIT() {
    return HTTP.get(`users/it`).then(res => res.data);
  },

  // Проверяет доступность логина
  checkLoginAvailable(login) {
    return HTTP.get(`users/checklogin/${login}`).then(res => res.data)
  },

  // Создает пользователя
  postUser(user) {
    return HTTP.post(`users`, user).then(res => res.data)
  },

  // Редактирует пользователя
  putUser(id, user) {
    return HTTP.put(`users/${id}`, user).then(res => res.data)
  },

  // Редактирует пользователя
  changeUserPassword(id, password) {
    return HTTP.put(`users/${id}/changePassword`, password).then(res => res.data)
  },

  // Загружает пользоваталей из файла
  uploadUsers(file, rewrite) {
    const formData = new FormData()
    formData.append('file', file[0].file)
    return HTTP.post(`users/upload?rewrite=${rewrite}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  // Удаляет пользователя по id
  deleteUser(id) {
    return HTTP.delete(`users/${id}`).then(res => res.data);
  },

  // Возвращает роли
  getRoles() {
    return HTTP.get(`roles`).then(res => res.data);
  },

  // Возвращает роль по id
  getRole(id) {
    return HTTP.get(`roles/${id}`).then(res => res.data);
  },

  // Создает роль
  postRole(role) {
    return HTTP.post(`roles`, role).then(res => res.data);
  },

  // Удаляет роль по id
  deleteRole(id) {
    return HTTP.delete(`roles/${id}`).then(res => res.data);
  },

  // Возвращает подразделения
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
  },

  // Возвращает отделения
  getDepartments() {
    return HTTP.get(`departments`).then(res => res.data);
  },

  // Возвращает отделение по id
  getDepartment(id) {
    return HTTP.get(`departments/${id}`).then(res => res.data);
  },

  // Создает отделение
  postDepartment(department) {
    return HTTP.post(`departments`, department).then(res => res.data);
  },

  // Удаляет отделение по id
  deleteDepartment(id) {
    return HTTP.delete(`departments/${id}`).then(res => res.data);
  },
  
  // Возвращает категории проблем
  getProblemCategories() {
    return HTTP.get(`problemCategories`).then(res => res.data);
  },
  
  // Возвращает категорию проблемы по id
  getProblemCategory(id) {
    return HTTP.get(`problemCategories/${id}`).then(res => res.data);
  },

  // Создает категорию проблемы
  postProblemCategory(problemCategory) {
    return HTTP.post(`problemCategories`, problemCategory).then(res => res.data);
  },

  // Удаляет категорию проблемы по id
  deleteProblemCategory(id) {
    return HTTP.delete(`problemCategories/${id}`).then(res => res.data);
  },

  // Возвращает комментарии к заявке
  getCommentsForTicket(ticketId) {
    return HTTP.get(`comments/ticket/${ticketId}`).then(res => res.data);
  },

  // Создает комментарий
  postComment(comment) {
    return HTTP.post(`comments`, comment).then(res => res.data);
  }
}
