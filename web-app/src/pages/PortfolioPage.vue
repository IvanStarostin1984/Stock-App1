<template>
  <div class="page">
    <h1>Portfolio Page</h1>
    <table v-if="holdings.length">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Qty</th>
          <th>Buy Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in holdings" :key="h.id">
          <td>{{ h.symbol }}</td>
          <td>{{ h.quantity }}</td>
          <td>{{ h.buyPrice }}</td>
          <td><button @click="removeHolding(h.id)">Remove</button></td>
        </tr>
      </tbody>
    </table>
    <p>Total Value: {{ total }}</p>
  </div>
</template>

<script setup lang="ts">
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
import { useAppStore } from '@/stores/appStore';
import type { PortfolioHolding } from '@/repositories/PortfolioRepository';
import { computed, onMounted } from 'vue';
const store = useAppStore();
const holdings = computed(() => store.holdings);
const total = computed(() => store.portfolioTotal);

onMounted(async () => {
  store.syncWatchList();
  await store.loadPortfolio();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
async function addHolding(h: PortfolioHolding) {
  await store.addHolding(h);
}

async function removeHolding(id: string) {
  await store.removeHolding(id);
}

useLoadTimeLogger('PortfolioPage');
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
