<template>
  <div class="page">
    <h1>Pro Page</h1>
  </div>
</template>

<script setup lang="ts">
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
import { useAppStore } from '@/stores/appStore';
import { onMounted } from 'vue';
const store = useAppStore();

onMounted(() => {
  store.upgradePro();
});

useLoadTimeLogger('ProPage');
</script>

<style scoped>
.page {
  padding: var(--space-grid-4);
  font-family: var(--font-family-sf-pro-text);
  font-weight: var(--font-weight-regular);
}
h1 {
  font-family: var(--font-family-sf-pro-display);
  font-weight: var(--font-weight-bold);
  color: var(--clr-primary-700);
}
</style>
