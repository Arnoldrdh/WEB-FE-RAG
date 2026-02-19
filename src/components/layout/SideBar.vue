<template>
  <aside :class="['fixed left-0 top-0 h-screen flex flex-col bg-[#08121f]/95 backdrop-blur-xl border-r border-white/[0.06] z-20 transition-all duration-300 overflow-hidden',
    collapsed ? 'w-20' : 'w-64']">

    <!-- Logo -->
    <div class="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06] min-h-[68px]">
      <div class="w-[38px] h-[38px] shrink-0 rounded-[11px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 shadow-[0_2px_10px_rgba(13,148,136,0.25)]">
        <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      </div>
      <transition name="fade">
        <div v-if="!collapsed" class="overflow-hidden">
          <p class="text-[0.9rem] font-bold text-white/90 whitespace-nowrap tracking-tight">KnowledgeDesk</p>
          <p class="text-[0.65rem] text-white/30 whitespace-nowrap uppercase tracking-widest">Admin Panel</p>
        </div>
      </transition>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-0.5">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        :class="[
          'flex items-center rounded-[10px] text-[0.82rem] font-medium transition-all duration-150 no-underline',
          collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
          isActive(item.path)
            ? 'bg-gradient-to-r from-blue-600/25 to-teal-500/20 text-teal-300 border border-teal-500/20'
            : 'text-white/40 hover:bg-white/[0.05] hover:text-white/70'
        ]"
      >
        <svg class="shrink-0 w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon"/>
        </svg>
        <transition name="fade">
          <span v-if="!collapsed">{{ item.name }}</span>
        </transition>
      </router-link>
    </nav>

    <!-- Bottom -->
    <div class="px-2.5 pb-3 pt-2 border-t border-white/[0.06] flex flex-col gap-1">
      <button
        @click="handleLogout"
        :class="[
          'flex items-center rounded-[10px] text-[0.82rem] font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-150 w-full',
          collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
        ]"
      >
        <svg class="shrink-0 w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <transition name="fade">
          <span v-if="!collapsed">Logout</span>
        </transition>
      </button>

      <button @click="$emit('toggle')"
        class="w-full flex items-center justify-center p-2 rounded-[9px] text-white/20 hover:bg-white/[0.05] hover:text-white/50 transition">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path v-if="collapsed" stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import authService from '@/services/authService';

const props = defineProps({ collapsed: { type: Boolean, default: false } });
defineEmits(['toggle']);

const route  = useRoute();
const router = useRouter();

const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    name: 'Documents',
    path: '/admin/documents',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
];

const isActive = (path) => route.path === path;
const handleLogout = () => { authService.logout(); router.push('/admin/login'); };
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>