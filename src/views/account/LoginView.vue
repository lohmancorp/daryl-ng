<!-- Filename: LoginView.vue -->
<!-- Path: /src/views/account/LoginView.vue -->

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore } from '@/stores';

const schema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
});

function onSubmit(values, { setErrors }) {
    const authStore = useAuthStore();
    const { username, password } = values;

    return authStore.login(username, password)
        .catch(error => setErrors({ apiError: error }));
}
</script>

<template>
    <div class="row">
        <div class="col-md-6 offset-md-3 mt-5">
             <div class="card">
                <h4 class="card-header">Vue 3 + Pinia - User Login</h4>
                <div class="card-body">
                    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
                        <div class="form-group">
                            <label>Username</label>
                            <Field name="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
                            <div class="invalid-feedback">{{ errors.username }}</div>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                            <div class="invalid-feedback">{{ errors.password }}</div>
                        </div>
                        <div class="form-group d-flex justify-content-between align-items-center">
                            <button class="btn btn-primary" :disabled="isSubmitting">
                                <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                                Login
                            </button>
                            <router-link to="register" class="btn btn-link">Register</router-link>
                        </div>
                        <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{ errors.apiError }}</div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>
