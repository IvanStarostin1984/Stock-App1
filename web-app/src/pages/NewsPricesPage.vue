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
    <div v-if="store.articles && store.articles.length">
      <h2>News</h2>
      <ul>
        <li v-for="a in store.articles" :key="a.url">
          <a :href="a.url" target="_blank" rel="noopener">{{ a.title }}</a>
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
  font-family: var(--font-family-sf-pro-text);
  font-weight: var(--font-weight-regular);
}
h1 {
  font-family: var(--font-family-sf-pro-display);
  font-weight: var(--font-weight-bold);
  color: var(--clr-primary-700);
}
</style>
