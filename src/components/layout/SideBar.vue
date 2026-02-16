<template>
  <aside
    :class="sidebarClasses"
    class="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-20 flex flex-col"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div v-if="!collapsed" class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold text-gray-900">KnowledgeDesk</h1>
          <p class="text-xs text-gray-500">Admin Panel</p>
        </div>
      </div>
      <div v-else class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <div class="space-y-1 px-3">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          :class="getLinkClasses(item.path)"
          class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group"
        >
          <svg class="w-5 h-5 flex-shrink-0" :class="collapsed ? 'mx-auto' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span v-if="!collapsed" class="font-medium">{{ item.name }}</span>
          <span v-if="!collapsed && item.badge" class="ml-auto bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {{ item.badge }}
          </span>
        </router-link>
      </div>
    </nav>

    <!-- Bottom: Toggle + Logout -->
    <div class="border-t border-gray-200 p-3 space-y-1">
      <!-- Logout -->
      <button
        @click="handleLogout"
        class="w-full flex items-center px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 group"
      >
        <svg class="w-5 h-5 flex-shrink-0" :class="collapsed ? 'mx-auto' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-if="!collapsed" class="font-medium">Logout</span>
      </button>

      <!-- Collapse Toggle -->
      <button
        @click="$emit('toggle')"
        class="w-full flex items-center justify-center px-3 py-2.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="collapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle']);

const route = useRoute();
const router = useRouter();

const sidebarClasses = computed(() => {
  return props.collapsed ? 'w-20' : 'w-64';
});

const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    name: 'Documents',
    path: '/admin/documents',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    badge: '12'
  },

];

const getLinkClasses = (path) => {
  const isActive = route.path === path;
  return isActive
    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
    : 'text-gray-700 hover:bg-gray-100';
};

const handleLogout = () => {
  // Bersihkan auth token / session
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect ke login
  router.push('/login');
};
</script>