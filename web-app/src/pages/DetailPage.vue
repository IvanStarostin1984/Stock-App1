<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
import { useAppStore } from '@/stores/appStore';
const route = useRoute();
const store = useAppStore();
useLoadTimeLogger('DetailPage');
onMounted(() => {
  if (typeof route.params.symbol === 'string') {
    store.loadHeadline(route.params.symbol);
  }
});
</script>

<template>
  <div class="page">
    <h1>Detail Page</h1>
    <p>Symbol: {{ route.params.symbol }}</p>
  </div>
</template>

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
