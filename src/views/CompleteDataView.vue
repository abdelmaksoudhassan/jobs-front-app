<template>
  <h6 class="center">Complete Data</h6>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
  >
    <div class="row justify-around">
      <div class="col-12 col-sm-6">
        <CategorySelect @specialtyChanged="$event=>specialty=$event" ref="CategorySelectRef">
        </CategorySelect>
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-6">
        <q-uploader
          style="width: 100%;"
          label="Upload CV.. (pdf)"
          ref="uploader"
          hide-upload-btn
          @rejected="onRejected"
          accept=".pdf"
          :max-file-size="1024*1024"
          square
          flat
          bordered
        />
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-6">
        <q-btn label="Submit" type="submit" color="primary" :loading="loading" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </div>
  </q-form>
</template>
<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import axios from '@/helpers/axios.js'
import { useCategoryStore } from '@/stores/UseCategoryStore'
import { err_Msg } from '@/helpers/functions'
import { useAuthStore } from '@/stores/UseAuthStore'
import CategorySelect from '@/components/category-select.vue'

export default {
  components: {CategorySelect},
  setup () {
    const $q = useQuasar()
    const categoryStore = useCategoryStore()
    const specialty = ref(null)
    const loading = ref(false)
    const authStore = useAuthStore()
    const CategorySelectRef = ref(null)

    return {
      specialty,
      categoryStore,
      loading,
      authStore,
      CategorySelectRef,

      onRejected(rejectedEntries){
        $q.notify({
            type: 'negative',
            message: `${rejectedEntries.length} file(s) did not pass validation constraints`
        })
      }
    }
  },
  created(){
    setTimeout(()=>{
      const extra = this.authStore.extra
      const user = this.authStore.user
      if(!! extra){
        this.$router.push({name: 'profile',params: {id: user.id}})
      }
    },1000)
  },
  methods:{
    onReset () {
      this.$refs.uploader.reset()
      this.specialty = null
      this.CategorySelectRef.category = null
      },
      onSubmit () {
        if(this.$refs.uploader.files.length == 0){
          return this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to upload CV'
          })
        }
        const formData = new FormData()
        formData.append('specialty',this.specialty)
        formData.append('cv',this.$refs.uploader.files[0])
        this.loading = true
        axios({requiresAuth: true}).post('/complete-data',formData).then(res=>{
          const extraData = res.data
          this.authStore.$patch({extra: extraData})
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
          this.loading = false
          setTimeout(()=>{
            this.$router.back()
          },1000)
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
