<template>
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
      <div class="col-12 col-sm-5">
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
      <div class="col-12 col-sm-5">
        <q-input
          filled
          v-model="email"
          label="Your email *"
          hint="Email"
          lazy-rules
          :rules="[val => val && isValidEmail(val) || 'Invalid email address']"
        />
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-11">
        <q-input
          filled
          type="password"
          v-model="password"
          label="Your password *"
          hint="Password"
          lazy-rules
          :rules="[val => val && isValidLength(8,25,val) || 'Invalid password length (8-25)']"
        />
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-11">
        <q-toggle v-model="accept" label="I accept the license and terms" />
      </div>
    </div>

    <div class="row justify-around">
      <div class="col-12 col-sm-11">
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
import { err_Msg } from '@/helpers/functions'
import { isValidEmail, isValidLength} from '../../helpers/validators'
export default {
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const firstName = ref(null)
    const lastName = ref(null)
    const age = ref(null)
    const email = ref(null)
    const password = ref(null)
    const accept = ref(false)
    const loading = ref(false)
    const resetBtn = ref(null)
    const prepareForm = () => {
      const formData = {
        firstName: firstName.value,
        lastName: lastName.value,
        age: age.value,
        email: email.value,
        password: password.value
      }
      return formData
    }
    
    return {
      firstName,
      lastName,
      email,
      age,
      password,
      accept,
      loading,
      isValidEmail,
      isValidLength,
      resetBtn,

      onSubmit () {
        if (accept.value !== true) {
          return $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        }
        const formData = prepareForm()
        loading.value = true
        axios().post('/signup',formData).then(res=>{
          const {message} = res.data
          $q.notify({
            color: 'green-5',
            textColor: 'white',
            icon: 'cloud_done',
            message
          })
          resetBtn.value.$el.click()
          loading.value = false
          router.push({name: 'login'})
        }).catch(error=>{
          const message = error.response ? error.response.data.message : err_Msg()
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message
          })
          console.log(error)
          loading.value = false
        })
      },
      onReset () {
        firstName.value = null
        lastName.value = null
        age.value = null
        email.value = null
        password.value = null
        accept.value = false
      }
    }
  }
}
</script>
