<template>
  <footer class="bg-white border-t border-gray-200 px-6 py-4">
    <div class="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
      <p>&copy; {{ currentYear }} KnowledgeDesk. All rights reserved.</p>
      <div class="flex items-center space-x-4 mt-2 md:mt-0">
        <a href="#" class="hover:text-blue-600 transition">Privacy Policy</a>
        <span class="text-gray-300">|</span>
        <a href="#" class="hover:text-blue-600 transition">Terms of Service</a>
        <span class="text-gray-300">|</span>
        <a href="#" class="hover:text-blue-600 transition">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>