<template>
  <BaseLayout>
    <div class="relative min-h-screen flex bg-[#0c1a2e]">

      <!-- Background orbs -->
      <div class="pointer-events-none fixed top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(29,111,164,0.14),transparent_70%)] blur-[80px] z-0"></div>
      <div class="pointer-events-none fixed bottom-[-150px] left-[200px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.1),transparent_70%)] blur-[80px] z-0"></div>

      <!-- Sidebar -->
      <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />

      <!-- Main -->
      <div class="relative z-10 flex-1 flex flex-col transition-all duration-300 min-w-0"
        :class="sidebarCollapsed ? 'ml-20' : 'ml-64'">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <main class="flex-1 overflow-y-auto p-7">
          <slot />
        </main>
        <Footer />
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue';
import BaseLayout from './BaseLayout.vue';
import Sidebar from './SideBar.vue';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

const sidebarCollapsed = ref(false);
const toggleSidebar = () => { sidebarCollapsed.value = !sidebarCollapsed.value; };
</script>