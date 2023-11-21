<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="row justify-end">
        <q-btn dense flat round icon="menu" @click="left = !left"/>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="left" side="right" bordered>
      <q-list class="q-pt-xl">
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/authentication" v-if="!auth">
          <q-item-section avatar>
            <q-icon name="login" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Authentication</q-item-section>
        </q-item>
        <q-item clickable v-ripple v-if="auth" :to="'/profile/'+id">
          <q-item-section avatar>
            <q-icon name="person" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Profile</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/posts">
          <q-item-section avatar>
            <q-icon name="work" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Posts</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/manage-Category" v-if="admin">
          <q-item-section avatar>
            <q-icon name="category" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Category Management</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/manage-admins" v-if="admin">
          <q-item-section avatar>
            <q-icon name="security" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Admins Management</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/manage-Jobs" v-if="auth">
          <q-item-section avatar>
            <q-icon name="keyboard" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Jobs Management</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/profile-setting" v-if="auth">
          <q-item-section avatar>
            <q-icon name="update" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Profile Setting</q-item-section>
        </q-item>
        <q-item v-ripple v-if="auth">
          <q-item-section avatar>
            <q-btn color="black" glossy  @click="onLogout" label="Logout" icon="logout" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <slot name="layout"></slot>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import {ref,computed} from 'vue'
import {useAuthStore} from '../stores/UseAuthStore'
import { useRouter } from 'vue-router';
import { clearToken } from '../helpers/functions';

const router = useRouter()
const left = ref(false)
const id = computed(()=>{return useAuthStore().user ? useAuthStore().user.id : null})
const auth = computed(()=>{return useAuthStore().auth})
const admin = computed(()=>{return useAuthStore().isAdmin})
const onLogout = () =>{
  clearToken()
  router.push('/')
  useAuthStore().$reset()
}
</script>