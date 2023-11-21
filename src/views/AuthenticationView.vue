<template>
    <div>
        <div class="splitter"></div>
        <nav class="links">
            <RouterLink to="/login" class="link" active-class="active">Login</RouterLink>
            <span> | </span>
            <RouterLink to="/signup" class="link" active-class="active">Signup</RouterLink>
        </nav>
        <div class="splitter"></div>
        <main>
            <RouterView />
        </main>
    </div>
</template>
<script setup>
import {useRouter} from 'vue-router'
</script>