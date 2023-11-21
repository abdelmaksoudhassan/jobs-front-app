<template>
    <q-btn :loading="loading" color="grey-4" text-color="purple" glossy  icon="mail" label="Apply" @click="onApply" />
</template>
<script setup>
import axios from '../helpers/axios'
import { useQuasar } from 'quasar'
import {ref} from 'vue'
import { err_Msg } from '../helpers/functions';
import { useAuthStore } from '../stores/UseAuthStore';

const authStore = useAuthStore()
const props = defineProps({
    id:{
        type: Number,
        required: true
    }
})
const $q = useQuasar()
const loading = ref(false)
const onApply = () =>{
    if(! authStore.user){
        return $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Before apply, You need to be authenticated'
        })
    }
    const {id} = props
    loading.value = true
    axios({requiresAuth: true}).post(`/apply-job/${id}`).then(res=>{
        loading.value = false
        const {message} = res.data
        $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message
        })
    }).catch(error=>{
        loading.value = false
        const message = error.response ? error.response.data.message : err_Msg()
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message
        })
        console.log(error)
    })
}
</script>