// Filename: main.js
// Path: /src/main.js

import { createApp } from 'vue';
import { createPinia } from 'pinia';

// It's good practice to import App before other local modules.
import App from './App.vue';
import { router } from './router';
import './assets/styles.css';

// setup fake backend
import { fakeBackend } from './helpers';
fakeBackend();

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');