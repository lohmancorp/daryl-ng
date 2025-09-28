<!-- Filename: App.vue -->
<!-- Path: /src/App.vue -->

<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore, useAlertStore } from '@/stores';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { logout } = authStore;

const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);
</script>

<template>
    <div class="app-container bg-light" :class="alert && 'bg-light'">
        <nav v-if="user" class="navbar navbar-expand navbar-dark bg-dark">
            <div class="navbar-nav">
                <router-link to="/" class="nav-item nav-link">Home</router-link>
                <router-link v-if="user?.role === 'Admin'" to="/users" class="nav-item nav-link">Users</router-link>
                <a @click="logout" class="nav-item nav-link">Logout</a>
            </div>
        </nav>
        <div class="container pt-4 pb-4">
            <alert v-if="alert" :alert="alert"></alert>
            <router-view></router-view>
        </div>
    </div>
</template>

<style>
@import '@/assets/base.css';
</style>
