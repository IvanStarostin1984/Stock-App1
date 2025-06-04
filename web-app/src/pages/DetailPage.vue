<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <div class="page">
    <h1>Detail Page</h1>
    <p>Symbol: {{ route.params.symbol }}</p>
  </div>
</template>
