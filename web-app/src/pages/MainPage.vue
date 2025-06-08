<template>
  <div class="page">
    <h1>Main Page</h1>
  </div>
</template>

<script setup lang="ts">
import { useLoadTimeLogger } from '@/utils/useLoadTimeLogger';
import { useAppStore } from '@/stores/appStore';
import { onMounted } from 'vue';

const store = useAppStore();
useLoadTimeLogger('MainPage');
onMounted(() => {
  store.loadHeadline();
});
</script>
