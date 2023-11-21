<template>
    <div class="q-pa-md">
        <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
        >
        <div class="row justify-between">
            <div class="col-12 col-sm-7">
                <q-input
                    v-model="email"
                    label="Email *"
                    hint="You can type user email and upgrade him to be admin"
                    lazy-rules
                    :rules="[val => val && isValidEmail(val) || 'Invalid email address']"
                />
            </div>
            <div class="col-12 col-sm-4 self-center">
                <q-btn label="Upgrade" type="submit" color="red" glossy :loading="updating" />
                <q-btn label="Reset" type="reset" ref="passwordRst" glossy class="q-ml-sm" />
            </div>
        </div>
    </q-form>
  </div>
  <q-separator inset />
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Admins List"
      :filter="filter"
      :loading="loading"
      :rows="admins"
      :columns="columns"
      row-key="email"
    >
        <template v-slot:top-right>
            <q-input dense debounce="300" v-model="filter" placeholder="Search...">
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
                    style="height: 50px; max-width: 50px;"
                />
            </q-td>
        </template>
        <template v-slot:body-cell-email="props">
            <q-td :props="props">{{ props.row.email }}</q-td>
        </template>
        <template v-slot:body-cell-fullName="props">
            <q-td :props="props">{{ props.row.fullName }}</q-td>
        </template>
    </q-table>
  </div>
</template>
<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue';
import axios from '../helpers/axios';
import { err_Msg } from '../helpers/functions';
import { isValidEmail } from '../helpers/validators';
const columns = [
    {
        name: 'avatar',
        label: 'avatar',
        align: 'center',
    },
    {
        name: 'email',
        label: 'email',
        align: 'center',
    },
    {
        name: 'fullName',
        label: 'Full Name',
        align: 'center',
    }
]
export default{
    setup(){
        const $q = useQuasar()
        const filter = ref(null)
        const loading = ref(false)
        const updating = ref(false)
        const admins = ref([])
        const email = ref(null)
        return{
            columns,
            filter,
            loading,
            updating,
            admins,
            email,
            isValidEmail,

            get_url(avatar){
              const url = 'https://nodejs-jobs.onrender.com'
              return avatar ? `${url}/${avatar}` : "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            },
            onReset(){
                email.value = null
            },
            onSubmit(){
                updating.value = true
                axios({requiresAuth: true}).patch('/make-admin',{email: email.value}).then(res=>{
                    updating.value = false
                    const newAdmin = res.data
                    admins.value.unshift(newAdmin)
                    const {email} = newAdmin
                    $q.notify({
                        color: 'green-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: `${email} upgraded to admin`
                    })
                }).catch(error=>{
                    const message = error.response ? error.response.data.message : err_Msg()
                    $q.notify({
                        color: 'red-5',
                        textColor: 'white',
                        icon: 'warning',
                        message
                    })
                    console.log(error)
                    updating.value = false
                })
            }
        }
    },
    created(){
        this.loading = true
        axios().get('/admins').then(res=>{
            this.loading = false
            this.admins = res.data
        }).catch(err=>{
            this.loading = false
            this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: err_Msg()
            })
            console.log(err)
        })
    }
}
</script>