<template>
    <q-select filled clearable v-model="category" option-value="id"
      option-label="title" emit-value map-options :options="categories" label="Specialty" 
      hint="Specialty" lazy-rules
      :rules="[
        val => val !== null && val !== '' || 'Please select'
      ]"
    />
</template>
<script>
import { ref } from 'vue'
import axios from '../helpers/axios'
import { mapState } from 'pinia'
import { useCategoryStore } from '@/stores/UseCategoryStore'
import { err_Msg } from '../helpers/functions'
export default{
    setup(){
        const category = ref(null)
        const categoryStore = useCategoryStore()
        return{
            categoryStore,
            category
        }
    },
    computed:{
        ...mapState(useCategoryStore,['categories'])
    },
    watch:{
        category: function(newVal,oldVal){
            if(newVal != oldVal){
                this.$emit('specialtyChanged',newVal)
            }
        }
    },
    created(){
        axios().get('/categories').then(res=>{
            const categories = res.data
            this.categoryStore.$patch({categories})
        }).catch(err=>{
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