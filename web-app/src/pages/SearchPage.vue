<template>
  <div class="page">
    <h1>Search Page</h1>
  </div>
</template>

<script setup lang="ts">
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
import { useAppStore } from '@/stores/appStore';
import { onMounted } from 'vue';
const store = useAppStore();

useLoadTimeLogger('SearchPage');
onMounted(() => {
  store.search('AAP');
});
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
</style>
