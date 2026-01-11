<template>
  <div class="min-h-screen bg-gray-50">
    <slot name="header" />
    <main class="flex-1">
      <slot />
    </main>
    <slot name="footer" />
  </div>
</template>

<script setup>
// Base layout component - wrapper untuk semua layout
</script>