<!-- src/layouts/AccountLayout.vue -->
<template>
    <div class="account-layout">
      <!-- 這裡只放 router-view，不包含 header -->
      <router-view />
    </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  
  .account-layout {
    min-height: 100vh;

  }
  </style>