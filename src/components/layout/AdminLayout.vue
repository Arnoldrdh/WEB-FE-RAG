<template>
  <BaseLayout>
    <div class="min-h-screen flex bg-gray-50">
      <!-- Sidebar -->
      <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col" :class="sidebarCollapsed ? 'ml-20' : 'ml-64'">
        <!-- Navbar -->
        <Navbar @toggle-sidebar="toggleSidebar" />

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <slot />
        </main>

        <!-- Footer -->
        <Footer />
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue';
import BaseLayout from './BaseLayout.vue';
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

const sidebarCollapsed = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
</script>