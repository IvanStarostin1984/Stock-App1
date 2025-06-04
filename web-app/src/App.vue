<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <nav>
    <RouterLink to="/">Main</RouterLink> |
    <RouterLink to="/search">Search</RouterLink> |
    <RouterLink to="/news-prices">News & Prices</RouterLink> |
    <RouterLink to="/portfolio">Portfolio</RouterLink> |
    <RouterLink to="/pro">Pro</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  margin-bottom: 1rem;
}
nav a {
  margin: 0 0.5rem;
}
</style>
