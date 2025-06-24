<template>
  <div class="page">
    <h1>Watch List</h1>
    <ul>
      <li v-for="s in symbols" :key="s">{{ s }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { WatchListRepository } from '@/repositories/WatchListRepository';
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';

const repo = new WatchListRepository();
const symbols = ref<string[]>([]);

onMounted(async () => {
  symbols.value = await repo.list();
});

useLoadTimeLogger('WatchListPage');
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
