<template>
  <div class="page">
    <h1>Portfolio Page</h1>
    <p>Total Value: {{ total }}</p>
  </div>
</template>

<script setup lang="ts">
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
import { useAppStore } from '@/stores/appStore';
import { PortfolioRepository } from '@/repositories/PortfolioRepository';
import { ref, onMounted } from 'vue';
const store = useAppStore();
const repo = new PortfolioRepository();
const total = ref(0);

onMounted(async () => {
  store.syncWatchList();
  total.value = await repo.refreshTotals();
});

useLoadTimeLogger('PortfolioPage');
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
