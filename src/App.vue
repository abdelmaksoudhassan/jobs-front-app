<template>
  <NavBar>
    <template #layout>
      <main class="padding_v margin_h">
        <RouterView />
      </main>
    </template>
  </NavBar>
</template>
<script>
import NavBar from './components/NavBar.vue'
import axios from './helpers/axios'
import { mapActions } from 'pinia'
import { useAuthStore } from './stores/UseAuthStore'
export default{
  components: {NavBar},
  async created(){
    try{
      const authData = (await axios({requiresAuth: true}).post('/auto-login')).data
      const {user} = authData
      this.setAuthData(user)
      if(user && !user.admin){
        const {extraData} = authData
        this.setExtraData(extraData)
      }
    }
    catch(err){
      console.log(err)
    }
  },
  methods:{
    ...mapActions(useAuthStore,['setAuthData','setExtraData'])
  }
}
</script>