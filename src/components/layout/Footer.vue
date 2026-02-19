<template>
  <footer class="border-t border-white/[0.06] px-6 py-4">
    <div class="flex flex-col md:flex-row items-center justify-between text-[0.75rem] text-white/25">
      <p>&copy; {{ currentYear }} KnowledgeDesk. All rights reserved.</p>
      <div class="flex items-center gap-4 mt-2 md:mt-0">
        <a href="#" class="hover:text-white/55 transition">Privacy Policy</a>
        <span class="text-white/10">|</span>
        <a href="#" class="hover:text-white/55 transition">Terms of Service</a>
        <span class="text-white/10">|</span>
        <a href="#" class="hover:text-white/55 transition">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
const currentYear = computed(() => new Date().getFullYear());
</script>