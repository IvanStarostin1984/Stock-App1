<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
const route = useRoute();
useLoadTimeLogger('DetailPage');
</script>

<template>
  <div class="page">
    <h1>Detail Page</h1>
    <p>Symbol: {{ route.params.symbol }}</p>
  </div>
</template>
