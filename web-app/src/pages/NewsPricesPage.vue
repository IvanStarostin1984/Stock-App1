<template>
  <div class="page">
    <h1>News & Prices</h1>
    <div v-if="store.topGainers.length">
      <h2>Top Gainers</h2>
      <ul>
        <li v-for="g in store.topGainers" :key="g.symbol">
          {{ g.symbol }} {{ g.price }}
        </li>
      </ul>
    </div>
    <div v-if="store.topLosers.length">
      <h2>Top Losers</h2>
      <ul>
        <li v-for="l in store.topLosers" :key="l.symbol">
          {{ l.symbol }} {{ l.price }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
import { useAppStore } from '@/stores/appStore';
import { onMounted } from 'vue';
const store = useAppStore();

onMounted(async () => {
  await store.loadTopMovers();
  store.toggleCurrency();
});

useLoadTimeLogger('NewsPricesPage');
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
