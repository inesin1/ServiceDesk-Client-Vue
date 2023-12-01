<script>
import {defineComponent} from 'vue'
import httpCommon from "@/http-common";
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user";

export default defineComponent({
  name: "SCreateTicketDialog",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    persistent: {
      type: Boolean,
      default: false
    },
    persistentNoAnimation: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 1000
    }
  },
  data: () => ({
    form: {
      valid: null,
      submitted: false,
      sent: false,
      errorsCount: 0,
      validators: {
        required: value => !!value || 'Поле обязательно для заполнения',
      },
      buttonLoading: false,

      fields: {
        creator: {
          value: null,
          items: [],
          disable: true
        },
        source: {
          value: 1,
          items: [],
          disable: true
        },
        category: {
          value: '',
          items: [],
        },
        details: null
      }
    },
  }),
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
     // Вызывается при успешной проверке формы
     async onSuccess() {
       try {
         this.form.buttonLoading = true;
         this.form.sent = true

         await httpCommon.createTicket({
           creatorId: this.form.fields.creator.value,
           sourceId: this.form.fields.source.value,
           categoryId: this.form.fields.category.value,
           details: this.form.fields.details
         })

         this.$waveui.notify('Заявка успешно создана!', 'success');
         this.$emit('loadTickets')
         this.$emit('close')
       } catch (e) {
         console.log('При создании заявки произошла ошибка: ' + e.message)
         this.$waveui.notify('При создании заявки произошла ошибка: ' + e.message, 'error')
       } finally {
         this.form.buttonLoading = false
       }
     },

     // Вызывается при проверке полей формы
     onValidate () {
       this.form.sent = false
       this.form.submitted = this.form.errorsCount === 0
     },
   },
  async created() {
    // load categories
    const ticketCategories = await httpCommon.getTicketCategories()
    this.form.fields.category.items = ticketCategories.map(tc => {
      return {
        label: tc.name,
        value: tc.id
      }
    })

    //load creators
    const users = await httpCommon.getUsers()
    this.form.fields.creator.items = users.map(u => {
      return {
        label: u.name,
        value: u.id
      }
    })
    this.form.fields.creator.items.sort((a, b) => ('' + a.label).localeCompare(b.label))

    this.form.fields.creator.value = this.userStore.user.id
    if (this.userStore.user.role.id === 3) {
      this.form.fields.creator.disable = false
    }

    // load sources
    const sources = await httpCommon.getTicketSources()
    this.form.fields.source.items = sources.map(s => {
      return {
        label: s.name,
        value: s.id
      }
    })

    if (this.userStore.user.role.id === 3) {
      this.form.fields.source.disable = false
    }
  }
})
</script>

<template>
  <w-dialog
      :model-value="show"
      :fullscreen="fullscreen"
      :width="width"
      :persistent="persistent"
      :persistent-no-animation="persistentNoAnimation"
      @close="form.valid = null"
      title-class="primary-light1--bg black">
    <template #title>
      <w-icon class="mr2">mdi mdi-pencil-outline</w-icon>
      Создать заявку
    </template>

    <div class="message-box">
      <w-transition-fade>
        <w-alert
            v-if="form.valid === false"
            error
            no-border
            class="my0 text-light">
          Имеются ошибки
        </w-alert>
      </w-transition-fade>
    </div>

    <w-form
        v-model="form.valid"
        v-model:errors-count="form.errorsCount"
        @validate="onValidate"
        @success="onSuccess"
        ref="form"
        class="w-flex column gap4 my2 mx4">

      <div class="caption mb2">
        Для более скорого решения проблемы укажите:
        <li>Локацию (отделение, кабинет)</li>
        <li>Способ связи (номер телефона)</li>
      </div>

      <w-select
          v-model="form.fields.creator.value"
          :items="form.fields.creator.items"
          label="Заявитель"
          required
          :validators="[form.validators.required]"
      ></w-select>
      <w-select
          v-model="form.fields.source.value"
          :items="form.fields.source.items"
          label="Источник"
          required
          :validators="[form.validators.required]"
      ></w-select>
      <w-select
          v-model="form.fields.category.value"
          :items="form.fields.category.items"
          label="Категория"
          required
          :validators="[form.validators.required]"
      ></w-select>
      <w-textarea v-model="form.fields.details">Что случилось?</w-textarea>
    </w-form>

    <template #actions>
      <div class="spacer" />
      <w-button
          @click="$refs.form.validate()"
          class="mr3"
          :loading="form.buttonLoading"
      >
        Создать
      </w-button>
      <w-button @click="this.$emit('close')">Отмена</w-button>
    </template>
  </w-dialog>
</template>

<style scoped>

</style>