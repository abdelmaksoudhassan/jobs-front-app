<template>
  <div v-if="extra" class="row justify-around">
    <div class="col-12 col-sm-11">
        <div class="q-pa-md">
          <Uploader url="cv" label="Update CV.. (pdf)" accept=".pdf" @posted="onPosted" style="width: 100%;"></Uploader>
        </div>
        <q-separator inset />
    </div>
  </div>
  <div class="q-pa-md">
    <q-form
      @submit="onEmailSubmit"
      @reset="onEmailReset"
      class="q-gutter-md"
    >
      <div class="row justify-around">
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
        <div class="col-12 col-sm-5">
          <q-input
            filled
            type="password"
            v-model="password"
            label="Your password *"
            hint="Password"
          />
        </div>
      </div>
      <div class="row justify-around">
        <div class="col-12 col-sm-11">
          <q-btn label="Submit" type="submit" color="primary" :loading="eUpdating" />
          <q-btn label="Reset" type="reset" ref="emailRst" color="primary" flat class="q-ml-sm" />
        </div>
      </div>
    </q-form>
  </div>
  <div class="row justify-around">
    <div class="col-12 col-sm-11">
      <q-separator inset />
    </div>
  </div>
  <div class="q-pa-md">
    <q-form
      @submit="onPasswordSubmit"
      @reset="onPasswordReset"
      class="q-gutter-md"
    >
      <div class="row justify-around">
        <div class="col-12 col-sm-5">
          <q-input
            filled
            type="password"
            v-model="newPassword"
            label="New password *"
            hint="New Password"
            lazy-rules
            :rules="[val => val && isValidLength(8,15,val) || 'Invalid password length (8-15)']"
          />
        </div>
        <div class="col-12 col-sm-5">
          <q-input
            filled
            type="password"
            v-model="oldpassword"
            label="Old password *"
            hint="Old Password"
            lazy-rules
          />
        </div>
      </div>
      <div class="row justify-around">
        <div class="col-12 col-sm-11">
          <q-btn label="Submit" type="submit" color="primary" :loading="pUpdating" />
          <q-btn label="Reset" type="reset" ref="passwordRst" color="primary" flat class="q-ml-sm" />
        </div>
      </div>
    </q-form>
  </div>
</template>
<script>
import { mapState } from 'pinia'
import { ref } from 'vue'
import Uploader from '@/components/uploader.vue'
import { useAuthStore } from '@/stores/UseAuthStore'
import { mapActions } from 'pinia'
import axios from '@/helpers/axios'
import { err_Msg } from '../../helpers/functions'
import { isValidEmail,isValidLength } from '../../helpers/validators'

export default {
  components:{ Uploader },
  setup () {
    const authStore = useAuthStore()

    const email = ref('')
    const password = ref('')
    const eUpdating = ref(false)

    const newPassword = ref('')
    const oldpassword = ref('')
    const pUpdating = ref(false)
    
    return {
      authStore,

      email,
      password,
      eUpdating,

      newPassword,
      oldpassword,
      pUpdating,

      isValidEmail,
      isValidLength,

      onEmailReset () {
        email.value = null
        password.value = null
      },

      onPasswordReset () {
        newPassword.value = null
        oldpassword.value = null
      }
    }
  },
  computed:{
    ...mapState(useAuthStore,['extra'])
  },
  methods:{
    ...mapActions(useAuthStore,['updateCV']),
    onPosted(cv){
      this.updateCV(cv)    
    },
    onEmailSubmit() {
      this.eUpdating = true
      axios({requiresAuth: true}).patch('/update-email',{
        email: this.email,
        password: this.password
      }).then(res=>{
        this.eUpdating = false
        const updated = res.data
        this.authStore.$patch({user: updated})
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'email updated'
        })
        this.$refs.emailRst.$el.click()
      }).catch(error=>{
        this.eUpdating = false
        const message = error.response ? error.response.data.message : err_Msg()
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message
        })
        console.log(error)
      })
    },
    onPasswordSubmit () {
      this.pUpdating = true
      const formData = {newPassword: this.newPassword,oldPassword: this.oldpassword}
      axios({requiresAuth: true}).patch('/update-password',formData).then(res=>{
        this.pUpdating = false
        const {message} = res.data
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message
        })
        this.$refs.passwordRst.$el.click()
      }).catch(error=>{
        this.pUpdating = false
        const message = error.response ? error.response.data.message : err_Msg()
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message
        })
        console.log(error)
      })
    }
  }
}
</script>