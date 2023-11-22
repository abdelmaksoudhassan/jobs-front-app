<template>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
  >
  <div class="row justify-around">
    <div class="col-12 col-sm-6">
      <q-input
        filled
        v-model="email"
        label="Your email *"
        hint="Email"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type your email']"
      />
    </div>
  </div>
  <div class="row justify-around">
    <div class="col-12 col-sm-6">
      <q-input
        filled
        type="password"
        v-model="password"
        label="Your password *"
        hint="Password"
        lazy-rules
        :rules="[
          val => val && val.length > 0 || 'Please type your password'
        ]"
      />
    </div>
  </div>
  <div class="row justify-around">
    <div class="col-12 col-sm-6">
      <q-btn label="Submit" :loading="loading" type="submit" color="primary"/>
      <q-btn label="Reset" ref="resetBtn" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </div>
  </q-form>
</template>
<script>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from '@/helpers/axios.js'
import { err_Msg, setSession } from '@/helpers/functions'
import { useAuthStore } from '@/stores/UseAuthStore'

export default {
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const email = ref('ahmedhassan@gmail.com')
    const password = ref('12345678')
    const loading = ref(false)
    const resetBtn = ref(null)
    const authStore = useAuthStore()

    const onSubmit = () =>{
      loading.value = true
      const formData = { email: email.value , password: password.value }
      axios().post('/login',{...formData}).then(response=>{
        const {user,token} = response.data
        authStore.setAuthData(user)
        if(! user.admin){
          const {extraData} = response.data
          authStore.setExtraData(extraData)
        }
        const role = user.admin ? 'admin' : 'user'
        setSession(token,role)
        loading.value = false
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Authenticated'
          })
        resetBtn.value.$el.click()
        router.push({name:'home'})
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

    return {
      email,
      password,
      loading,
      onSubmit,
      resetBtn,
      
      onReset () {
          email.value = null
          password.value = null
      }
    }
  }
}
</script>
