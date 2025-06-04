<template>
  <div v-if="quote" class="headline-card">
    <h2>{{ quote.symbol }} {{ quote.price }}</h2>
  </div>
  <p v-else>Loading...</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MarketstackService } from '@/services/MarketstackService';
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';

const service = new MarketstackService(import.meta.env.VITE_MARKETSTACK_KEY);
const quote = ref();
useLoadTimeLogger('HeadlineCard');

onMounted(async () => {
  quote.value = await service.getQuote('AAPL');
});
</script>

<style scoped>
.headline-card {
  border: 1px solid #ccc;
  padding: 1rem;
}
</style>
