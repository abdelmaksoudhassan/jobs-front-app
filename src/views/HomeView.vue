<template>
  <h4 class="center">Features,,,</h4>
  <OrderedList :items="items"></OrderedList>
  <div class="mini-splitter"></div>
  <q-btn class="center" v-if="! auth" color="secondary" label="Authenticate" icon-right="send" size="l" @click="goAuth" />
</template>
<script setup>
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import OrderedList from '../components/OrderedList.vue'
import { useAuthStore } from '../stores/UseAuthStore';

const router = useRouter()
const items = ref([
  'You can register in our site and manage your account',
  'You can create a new post and people can apply on it',
  'Your post will be published after our admin approval',
  'You can modify or delete your owen post',
  'Once you authenicated you can apply on other people jobs and manage your posts'
])
const auth = computed(()=>{ return useAuthStore().auth })
const goAuth = () =>{
  router.push({path: '/login'})
}
</script>