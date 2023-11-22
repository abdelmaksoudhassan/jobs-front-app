<template>
    <q-btn style="margin: 0px 2px;" label="Edit" size="sm" icon="edit" color="purple" @click="openDialog" />

    <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 300px">
        <q-card-section>
            <div class="text-h6">Edit title</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            >
            <q-input dense v-model="text" autofocus @keyup.enter="prompt = false" lazy-rules
                :rules="[
                val => val && isValidLength(3,25,val) || 'Invalid Name length (3-25)',
                val => val && onlyLettersAndSpaces(val) || 'Invalid Titles (letters and spaces only)'
                ]" />
            <q-btn label="Submit" type="submit" style="background: #FF0080; color: white" :loading="loading" />
            </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from 'vue'
import axios from '../helpers/axios'
import { useCategoryStore } from '../stores/UseCategoryStore'
import { mapActions } from 'pinia'
import { err_Msg } from '../helpers/functions'
import { isValidLength, onlyLettersAndSpaces } from '../helpers/validators'

export default {
    setup () {
        const prompt = ref(false)
        const text = ref('')
        const loading = ref(false)
        return {
            prompt,
            text,
            loading,
            onlyLettersAndSpaces,
            isValidLength
        }
    },
    props:{
        id:{
            type: Number,
            required: true
        },
        title:{
            type: String,
            required: true
        }
    },
    methods:{
        ...mapActions(useCategoryStore,['updateItem']),
        openDialog(){
            this.prompt = true
            this.text = this.title
        },
        onSubmit(){
            this.loading = true
            const formData = {title: this.text}
            axios({ requiresAuth:true }).patch(`/category/${this.id}`,formData).then(res=>{
                const updated = res.data
                this.updateItem(this.id,updated)
                this.$q.notify({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: `updated to ${this.text}`
                })
                this.loading = false
                this.prompt = false
            }).catch(error=>{
                const message = error.response ? error.response.data[0].message : err_Msg()
                this.$q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message
                })
                console.log(error)
                this.loading = false
            })
        }
    }
}
</script>
