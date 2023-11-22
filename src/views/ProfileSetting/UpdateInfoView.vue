<template>
  <div class="row justify-around">
    <div class="col-12 col-sm-11">
      <div class="q-pa-md">
        <Uploader url="avatar" label="Upload avatar..(jpg/jpeg/png)"
          accept=".jpg, .png, .jpeg" @posted="onPosted">
        </Uploader>
      </div>
      <q-separator inset />
    </div>
  </div>
  <div class="q-pa-md">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row justify-around">
        <div class="col-12 col-sm-5">
        <q-input
          filled
          v-model="firstName"
          label="First name *"
          hint="First Name"
          lazy-rules
          :rules="[val => val && isValidLength(3,25,val) || 'Invalid Name length (3-25)']"
        />
        </div>
        <div class="col-12 col-sm-5">
          <q-input
            filled
            v-model="lastName"
            label="Last name *"
            hint="Last Name"
            lazy-rules
            :rules="[val => val && isValidLength(3,25,val) || 'Invalid Name length (3-25)']"
          />
        </div>
      </div>
      <div class="row justify-around">
        <div class="col-12 col-sm-11">
          <q-input
            filled
            type="number"
            v-model="age"
            label="Your age *"
            hint="Age"
            lazy-rules
            :rules="[
              val => val >= 18 && val <= 80 || 'Please type a suitable age (18-80)'
            ]"
          />
        </div>
      </div>
      <div class="row justify-around">
        <div class="col-12 col-sm-11">
          <q-btn label="Submit" type="submit" color="primary" :loading="loading" />
          <q-btn label="Reset" ref="resetBtn" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </div>
    </q-form>
  </div>
</template>
<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import Uploader from '@/components/uploader.vue'
import { useAuthStore } from '@/stores/UseAuthStore'
import { mapActions } from 'pinia'
import axios from '@/helpers/axios'
import { err_Msg } from '../../helpers/functions'

export default {
  components:{ Uploader },
  setup () {
    const $q = useQuasar()
    const authStore = useAuthStore()

    const firstName = ref(null)
    const lastName = ref(null)
    const age = ref(null)
    const loading = ref(false)
    const resetBtn = ref(null)

    return {
      authStore,
      firstName,
      lastName,
      age,
      loading,
      resetBtn,

      isValidLength(min,max,field){
          return (field.length < min || field.length > max) ? false : true
      },

      onRejected (rejectedEntries) {
          $q.notify({
              type: 'negative',
              message: `${rejectedEntries.length} file(s) did not pass validation constraints`
          })
      },

      onSubmit () {
        loading.value = true
        axios({requiresAuth: true}).patch('/update-info',{
          firstName: firstName.value,
          lastName: lastName.value,
          age: age.value
        }).then(res=>{
          const updated = res.data
          authStore.$patch({user: updated})
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Updated'
          })
          loading.value = false
          resetBtn.value.$el.click()
        }).catch(err=>{
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: err_Msg()
          })
          console.log(err)
          loading.value = false
        })
      },

      onReset () {
        firstName.value = null
        lastName.value = null
        age.value = null
      }
    }
  },
  methods:{
    ...mapActions(useAuthStore,['updateAvatar']),
    onPosted(avatar){
      this.updateAvatar(avatar)    
    }
  }
}
</script>
  
