<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";

export default defineComponent({
  name: "STicketsFilter",
  data: () => ({
    fields: {
      categories: {
        value: [],
        items: []
      },
      statuses: {
        value: [],
        items: []
      },
      creators: {
        value: [],
        items: []
      },
      executors: {
        value: [],
        items: []
      },
      departments: {
        value: [],
        items: []
      },
    },
  }),
  methods: {
    apply() {
      localStorage.setItem('ticketsFilter', JSON.stringify({
        statuses: this.fields.statuses.value,
        categories: this.fields.categories.value,
        creators: this.fields.creators.value,
        executors: this.fields.executors.value,
        departments: this.fields.departments.value,
      }))

      this.$emit('apply')
    },

    reset() {
      this.fields.categories.value = [];
      this.fields.statuses.value = [];
      this.fields.creators.value = [];
      this.fields.executors.value = [];
      this.fields.departments.value = [];
      this.apply();
    }
  },
  async created() {
    if (!localStorage.getItem('ticketsFilter')) {
      localStorage.setItem('ticketsFilter', JSON.stringify({
        statuses: [],
        categories: [],
        creators: [],
        executors: [],
        departments: [],
      }))
    }

    const filterValues = JSON.parse(localStorage.getItem('ticketsFilter'))

    // load categories
    const categories = await httpCommon.getTicketCategories()
    this.fields.categories = {
      value: filterValues.categories,
      items: categories.map(c => {
        return {
          label: c.name,
          value: c.id
        }
      })
    }

    //load creators
    const users = await httpCommon.getUsers()
    this.fields.creators = {
      value: filterValues.creators,
      items: users.map(u => {
        return {
          label: u.name,
          value: u.id
        }
      })
    }

    //load executors
    const executors = await httpCommon.getUsersIT()
    this.fields.executors = {
      value: filterValues.executors,
      items: executors.map(e => {
        return {
          label: e.name,
          value: e.id
        }
      })
    }

    //load departments
    const departments = await httpCommon.getDepartments()
    this.fields.departments = {
      value: filterValues.departments,
      items: departments.map(d => {
        return {
          label: d.name,
          value: d.id
        }
      })
    }

    //load statuses
    const statuses = await httpCommon.getTicketStatuses()
    this.fields.statuses = {
      value: filterValues.statuses,
      items: statuses.map(s => {
        return {
          label: s.name,
          value: s.id
        }
      })
    }
  }
})
</script>

<template>
  <w-card
      title="Фильтр"
      bg-color="base-bg-color"
      class="mb4"
  >
    <w-form
        class="w-flex column gap4"
    >
      <w-select
          v-model="fields.categories.value"
          :items="fields.categories.items"
          label="Категории"
          label-position="left"
          outline
          multiple
      ></w-select>

      <w-select
          v-model="fields.departments.value"
          :items="fields.departments.items"
          label="Отделения"
          label-position="left"
          outline
          multiple
          disabled
      ></w-select>

      <w-select
          v-model="fields.creators.value"
          :items="fields.creators.items"
          label="Заявители"
          label-position="left"
          outline
          multiple
      ></w-select>

      <w-select
          v-model="fields.executors.value"
          :items="fields.executors.items"
          label="Исполнители"
          label-position="left"
          outline
          multiple
      ></w-select>

      <w-select
          v-model="fields.statuses.value"
          :items="fields.statuses.items"
          label="Статусы"
          label-position="left"
          outline
          multiple
      ></w-select>
    </w-form>

    <template #actions>
      <div class="spacer"/>
      <w-button
          @click="apply"
          class="mr3"
          bg-color="success"
      >
        Применить
      </w-button>

      <w-button
          @click="reset"
          class="mr3"
          bg-color="error"
      >
        Сбросить
      </w-button>
    </template>
  </w-card>
</template>

<style scoped>

</style>