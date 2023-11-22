<template>
    <q-btn label="Who is applied.." :loading="loading" color="primary" size="sm" @click="openDialog">
      <template v-slot:loading>
        <q-spinner-hourglass />
      </template>
    </q-btn>

    <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
    >
    <q-card>
        <q-bar class="bg-primary text-white">
            <q-space />

            <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
        </q-bar>

        <q-card-section>
            <div class="text-h6">Appliers</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="q-pa-md">
          <q-table
            flat bordered
            :rows="rows"
            :columns="columns"
            row-key="id"
            :filter="filter"
          >
            <template v-slot:top-right>
              <q-input dense debounce="300" color="primary" placeholder="Search..." v-model="filter">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-avatar="props">
                <q-td :props="props">
                  <q-img
                    :src="get_url(props.row.avatar)"
                    spinner-color="white"
                    style="height: 50px; max-width: 50px"
                  />
                </q-td>
            </template>
            <template v-slot:body-cell-profile="props">
                <q-td :props="props">
                  <q-btn color="red" glossy icon-right="send" label="Visit profile" @click="visitProfile(props.row.id)" />
                </q-td>
            </template>

          </q-table>
        </div>
        </q-card-section>
    </q-card>
    </q-dialog>
</template>
<script>
const columns = [
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'center',
    field: row => row.email,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'fullName',
    required: true,
    label: 'Full Name',
    align: 'center',
    field: row => row.fullName,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'age',
    required: true,
    label: 'Age',
    align: 'center',
    field: row => row.age,
    format: val => `${val} Years`,
    sortable: true
  },
  {
    name: 'avatar',
    label: 'Avatar',
    align: 'center',
  },
  {
    name: 'profile',
    align: 'center',
  }
]
import { ref } from 'vue'
import axios from '../helpers/axios'
import { err_Msg, get_url } from '../helpers/functions'
export default {
setup () {
        return {
            filter: ref(''),
            rows: ref([]),
            dialog: ref(false),
            maximizedToggle: ref(true),
            columns,
            loading: ref(false),
            get_url
        }
    },
    props:{
      id:{
        type: Number,
        required: true
      }
    },
    methods:{
      openDialog(){
        this.loading = true
        axios().get(`/get-appliers/${this.id}`).then(res=>{
            this.rows = res.data
            this.loading = false
            this.dialog = true
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
      visitProfile(id){
        this.$router.push({name: 'profile',params:{id}})
      }
    }
}
</script>
