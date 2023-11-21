<template>
  <q-table
    :loading="loading"
    flat
    bordered
    :rows="pending"
    :columns="columns"
    row-key="owner"
    :filter="filter"
  >
    <template v-slot:top-right>
      <q-input dense debounce="300" v-model="filter" placeholder="Search...">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <AcceptBtn @accept="onAccept" :id="props.row.id"></AcceptBtn>
        <DeleteBtn url="/job" :id="parseInt(props.row.id)" text="reject" @deleted="onDelete"></DeleteBtn>
      </q-td>
    </template>
  </q-table>
</template>
<script>
import { ref } from 'vue'
import axios from '@/helpers/axios.js'
import { mapState, mapActions } from 'pinia'
import { useJobsStore } from '@/stores/UseJobsStore'
import { err_Msg } from '../../helpers/functions'
import DeleteBtn from '../../components/delete-btn.vue'
import AcceptBtn from '../../components/accept-btn.vue'
const columns = [
  {
    name: 'title',
    required: true,
    label: 'Title',
    align: 'center',
    field: row => row.title,
    format: val => `${val} $`,
    sortable: false
  },
  {
    name: 'owner',
    required: true,
    label: 'Puplisher',
    align: 'center',
    field: row => row.User.email,
    format: val => `${val}`,
    sortable: false
  },
  {
    name: 'category',
    required: true,
    label: 'Category',
    align: 'center',
    field: row => row.category.title,
    format: val => `${val}`,
    sortable: false
  },
  {
    name: 'gender',
    required: true,
    label: 'Gender',
    align: 'center',
    field: row => row.gender,
    format: val => `${val}`,
    sortable: false
  },
  {
    name: 'salary',
    required: true,
    label: 'Salary',
    align: 'center',
    field: row => row.salary,
    format: val => `${val} $`,
    sortable: false
  },
  {
    name: 'type',
    required: true,
    label: 'Type',
    align: 'center',
    field: row => row.type,
    format: val => `${val}`,
    sortable: false
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
  }
]
export default{
    components:{DeleteBtn,AcceptBtn},
    setup () {
      const loading = ref(false)
    return {
      filter: ref(''),
      loading,
      columns
    }
  },
    computed:{ ...mapState(useJobsStore,['pending']) },
    created(){
        this.loading = true
        axios({ requiresAuth: true }).get('/pending-jobs').then(res=>{
            const pending = res.data
            this.setPending(pending)
            this.loading = false
        }).catch(err=>{
            $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: err_Msg()
            })
            console.log(err)
            this.loading = false
        })
    },
    methods:{
        ...mapActions(useJobsStore,['setPending','deleteFromPending','addToJobs','popFromJobs']),
        onDelete(id){
            this.deleteFromPending(id)
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: `Post rejected and deleted`
            })
        },
        onAccept(post){
          const {id} = post
          this.deleteFromPending(id)
          this.addToJobs(post)
          this.popFromJobs()
        }
    }
}
</script>