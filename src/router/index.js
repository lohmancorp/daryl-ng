// Filename: index.js
// Path: /src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores';
import { HomeView } from '@/views';
import { LoginView, RegisterView } from '@/views/account';
import { UsersLayout, UsersList, UsersAddEdit } from '@/views/users';

export const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: HomeView },
        {
            path: '/account',
            children: [
                { path: '', redirect: 'login' },
                { path: 'login', component: LoginView },
                { path: 'register', component: RegisterView }
            ]
        },
        {
            path: '/users',
            component: UsersLayout,
            meta: { requiresAdmin: true }, // Add meta field to protect all user management routes
            children: [
                { path: '', component: UsersList },
                { path: 'add', component: UsersAddEdit },
                { path: 'edit/:id', component: UsersAddEdit }
            ]
        },
        // catch all redirect to home page
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});

router.beforeEach(async(to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/account/login', '/account/register'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/account/login';
    }

    // redirect to home page if admin required and user is not an admin
    if (to.meta.requiresAdmin && auth.user ?.role !== 'Admin') {
        return '/';
    }
});
