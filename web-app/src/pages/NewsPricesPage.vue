<template>
  <div class="page">
    <h1>News & Prices</h1>
  </div>
</template>

<script setup lang="ts">
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
import { useAppStore } from '@/stores/appStore';
import { onMounted } from 'vue';
const store = useAppStore();

onMounted(() => {
  store.toggleCurrency();
});

useLoadTimeLogger('NewsPricesPage');
</script>
