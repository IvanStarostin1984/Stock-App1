<template>
  <div class="page login">
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="email" />
      <input v-model="password" type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const store = useAuthStore();
const email = ref('');
const password = ref('');

function submit() {
  store.login(email.value, password.value);
}
</script>

<style scoped>
.page {
  padding: var(--space-grid-4);
  font-family: var(--font-body);
}
h1 {
  font-family: var(--font-display);
  color: var(--clr-primary-700);
}
button {
  background-color: var(--clr-primary-600);
  color: var(--clr-neutral-050);
}
</style>
