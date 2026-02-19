<template>
  <nav class="sticky top-0 z-10 bg-[#0c1a2e]/85 backdrop-blur-xl border-b border-white/[0.07]">
    <div class="flex items-center justify-between px-6 py-3.5">

      <!-- Left -->
      <div class="flex items-center gap-4">
        <button @click="$emit('toggle-sidebar')"
          class="w-9 h-9 flex items-center justify-center bg-white/[0.05] border border-white/[0.07] rounded-[9px] text-white/40 hover:bg-white/[0.09] hover:text-white/70 transition">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- Breadcrumb -->
        <div class="hidden md:flex items-center gap-1.5 text-[0.8rem]">
          <a href="/admin" class="text-white/30 hover:text-white/60 transition">Dashboard</a>
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-white/20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-white/70 font-medium">{{ currentPage }}</span>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2.5">

        <!-- Search -->
        <div class="relative hidden md:block">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-white/25 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" placeholder="Cari..."
            class="w-48 pl-9 pr-4 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-[9px] text-white/70 text-[0.78rem] placeholder-white/20 outline-none focus:border-teal-500/50 focus:bg-white/[0.07] transition"/>
        </div>

        <!-- Notification -->
        <button class="relative w-9 h-9 flex items-center justify-center bg-white/[0.05] border border-white/[0.07] rounded-[9px] text-white/40 hover:bg-white/[0.09] hover:text-white/70 transition">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span class="absolute top-[7px] right-[7px] w-1.5 h-1.5 bg-red-400 rounded-full border-[1.5px] border-[#0c1a2e]"></span>
        </button>

        <!-- User info — static, no dropdown -->
        <div class="flex items-center gap-2.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-[10px]">
          <div class="w-7 h-7 rounded-[8px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 text-white text-[0.68rem] font-semibold shrink-0">
            AD
          </div>
          <div class="hidden md:block">
            <p class="text-[0.78rem] font-medium text-white/75 leading-tight">Admin User</p>
            <p class="text-[0.67rem] text-white/30 leading-tight">admin@knowledgedesk.com</p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineEmits(['toggle-sidebar']);

const route = useRoute();
const currentPage = computed(() => {
  const name = route.name?.toString() || '';
  return name.replace('admin-', '').charAt(0).toUpperCase() + name.slice(7);
});
</script>