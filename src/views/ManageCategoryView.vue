<template>
  <h6>Add category</h6>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
  >
    <q-input
      filled
      v-model="title"
      label="Category title *"
      hint="Title"
      lazy-rules
      :rules="[
        val => val && isValidLength(3,25,val) || 'Invalid Name length (3-25)',
        val => val && onlyLettersAndSpaces(val) || 'Invalid Titles (letters and spaces only)'
      ]"
    />
    <div>
      <q-btn label="Submit" type="submit" color="primary" :loading="adding" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" ref="resetBtn" />
    </div>
  </q-form>
  <q-separator style="margin: 20px 0px;"  />
  <h6>Management</h6>
  <q-table
    flat bordered
    :rows="categories"
    :columns="columns"
    row-key="id"
    :filter="filter"
    :loading="loading"
  >
    <template v-slot:top>
      <q-space />
      <q-input dense debounce="300" placeholder="Search..." color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <EditBtn :title="props.row.title" :id="props.row.id"></EditBtn>
        <DeleteBtn :id="props.row.id" url="/category" @deleted="onDelete"></DeleteBtn>
      </q-td>
    </template>
  </q-table>
</template>
<script>
import { ref } from 'vue'
import axios from '../helpers/axios'
import { useCategoryStore } from '../stores/UseCategoryStore'
import { mapState, mapActions } from 'pinia'
import { err_Msg } from '../helpers/functions'
import EditBtn from '../components/edit-btn.vue'
import DeleteBtn from '../components/delete-btn.vue'
import { onlyLettersAndSpaces, isValidLength } from '../helpers/validators'

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Title',
    align: 'center',
    field: row => row.title,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'created',
    required: true,
    label: 'Created at',
    align: 'center',
    field: row => row.createdAt,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
  }
]

export default {
  components:{ EditBtn, DeleteBtn },
  setup () {
    const title = ref(null)
    const categoryStore = useCategoryStore()
    const adding = ref(false)
    const loading = ref(false)
    const filter = ref(null)

    return {
      columns,
      title,
      categoryStore,
      adding,
      loading,
      filter,
      onlyLettersAndSpaces,
      isValidLength,

      onReset () {
        title.value = null
      }
    }
  },
  computed:{
      ...mapState(useCategoryStore,['categories'])
  },
  created(){
    this.loading = true
      axios().get('/categories').then(res=>{
          const categories = res.data
          this.setArr(categories)
          this.loading = false
      }).catch(err=>{
          this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'warning',
              message: err_Msg()
          })
          this.loading = false
          console.log(err)
      })
  },
  methods:{
      ...mapActions(useCategoryStore,['setArr','deleteItem']),
      onSubmit () {
          this.adding = true
          const formData = {title: this.title}
          axios({ requiresAuth: true }).post('/category',{...formData}).then(res=>{
              const {title} = res.data
              this.categoryStore.pushToArr(res.data)
              this.$refs.resetBtn.$el.click()
              this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: `${title} add`
              })
              this.adding = false
          }).catch(error=>{
              const message = error.response ? error.response.data.message : err_Msg()
              this.$q.notify({
                  color: 'red-5',
                  textColor: 'white',
                  icon: 'warning',
                  message
              })
              console.log(error)
              this.adding = false
          })
      },
      onDelete(id){
        this.deleteItem(id)
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: `category deleted`
        })
      },
  }
}
</script>
