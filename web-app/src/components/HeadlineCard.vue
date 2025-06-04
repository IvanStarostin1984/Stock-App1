<template>
  <div v-if="quote" class="headline-card">
    <h2>{{ quote.symbol }} {{ quote.close }}</h2>
    <p>{{ quote.date }}</p>
  </div>
  <p v-else>Loading...</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MarketstackService } from '@/services/MarketstackService';

const service = new MarketstackService(import.meta.env.VITE_MARKETSTACK_KEY);
const quote = ref();

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
