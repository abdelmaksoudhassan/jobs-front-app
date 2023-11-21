<template>
    <q-btn icon="done" color="green" size="sm" :loading="accepting" @click="onAccept">accept</q-btn>
</template>
<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue';
import axios from '../helpers/axios';
import { err_Msg } from '../helpers/functions';

const accepting = ref(false)
const emit = defineEmits(['accept'])
const $q = useQuasar()
const props = defineProps({
    id:{
        type: Number,
        required: true
    }
})
const onAccept = () => {
    accepting.value = true
    const {id} = props
    axios({ requiresAuth: true }).patch(`/accept-job/${id}`).then(res=>{
        const post = res.data
        emit('accept',post)
        $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: `Post accepted`
        })
        accepting.value = false
    }).catch(err=>{
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: err_Msg()
        })
        console.log(err)
        accepting.value = false
    })
}
</script>