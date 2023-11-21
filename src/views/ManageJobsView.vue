<template>
    <div>
        <div class="splitter"></div>
        <nav class="links">
            <div>
                <RouterLink :to="{name: 'postjob'}" class="link" active-class="active">Post job</RouterLink>
                <span> | </span>
            </div>
            <div v-if="admin">
                <RouterLink :to="{name: 'pendingjobs'}" class="link" active-class="active">Pending jobs</RouterLink>
                <span> | </span>
            </div>
            <div>
                <RouterLink :to="{name: 'myjobs'}" class="link" active-class="active">My jobs</RouterLink>
            </div>
        </nav>
        <div class="splitter"></div>
        <main>
            <RouterView />
        </main>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/UseAuthStore';
const admin = computed(()=>{return useAuthStore().isAdmin})
</script>