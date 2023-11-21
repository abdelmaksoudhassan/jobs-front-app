<template>
    <q-uploader
        ref="uploader"
        :label="label"
        :factory="factoryFn"
        @rejected="onRejected"
        :accept="accept"
        :max-file-size="1024*1024"
        square
        flat
        bordered
    />
</template>
<script setup>
import { useQuasar } from 'quasar'
import axios from '../helpers/axios';
import { err_Msg } from '../helpers/functions';
import { ref } from 'vue';
const $q = useQuasar()
const uploader  = ref(null)
const props = defineProps({
    url:{
        required: true,
        type: String
    },
    label:{
        required: true,
        type: String
    },
    accept:{
        required: true,
        type: String
    }
})
const emit = defineEmits(['posted'])
const onRejected = (rejectedEntries) => {
    $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
    })
}
const factoryFn = (file) => {
    const {url} = props
    var formData = new FormData();
    formData.append(`${url}`,file[0])
    axios({requiresAuth: true}).post(`https://nodejs-jobs.onrender.com/${url}`,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res=>{
        const {message} = res.data
        if(url == 'cv'){
            const {cv} = res.data
            emit('posted',cv)
        }else{
            const {avatar} = res.data
            emit('posted',avatar)
        }
        $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message
        })
        uploader.value.reset()
    }).catch(err=>{
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: err_Msg()
        })
        console.log(err)
    })
}
</script>