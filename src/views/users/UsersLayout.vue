<!-- Filename: UsersLayout.vue -->
<!-- Path: /src/views/users/UsersLayout.vue -->

<template>
    <div class="p-4">
        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
  name: "UsersLayout",
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.p-4 {
  padding: 1rem;
}
</style>
