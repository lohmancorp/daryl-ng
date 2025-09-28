<!-- Filename: HomeView.vue -->
<!-- Path: /src/views/HomeView.vue -->

<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
    <div v-if="user">
        <h1>Hi {{user.firstName}}!</h1>
        <p>You're logged in with Vue 3 + Pinia & JWT!!</p>
        <p v-if="user.role === 'Admin'"><router-link to="/users">Manage Users</router-link></p>
    </div>
</template>