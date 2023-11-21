<template>
    <q-btn style="margin: 0px 2px;" color="red-5" :loading="loading" icon="delete" @click="onDelete" size="sm" :label="text">
        <template v-slot:loading>
            <q-spinner-hourglass />
        </template>
    </q-btn>
</template>
<script>
import {ref} from 'vue'
import axios from '../helpers/axios'
import { err_Msg } from '../helpers/functions'
export default{
    setup(){
        const loading = ref(false)

        return{
            loading
        }
    },
    props:{
        id:{
            type: Number,
            required: true
        },
        url:{
            required: true,
            type: String
        },
        text:{
            type: String,
            default: 'Delete'
        }
    },
    methods:{
        onDelete(){
            this.loading = true
            const url = this.id  ? this.url + `/${this.id}` : this.url
            axios({ requiresAuth: true }).delete(url).then(res=>{
                this.id ? this.$emit('deleted',this.id) : this.$emit('deleted')
                this.loading = false
            }).catch(err=>{
                this.$q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message: err_Msg()
                })
                console.log(err)
                this.loading = false
            })
        }
    }
}
</script>