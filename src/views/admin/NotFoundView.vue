<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
    <div class="text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="relative inline-block">
          <h1 class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            404
          </h1>
          <div class="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full animate-bounce">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Message -->
      <h2 class="text-3xl font-bold text-gray-900 mb-4">
        Oops! Page Not Found
      </h2>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau URL salah.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <BaseButton
          variant="primary"
          size="lg"
          @click="goHome"
        >
          <template #icon-left>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </template>
          Back to Home
        </BaseButton>

        <BaseButton
          variant="outline"
          size="lg"
          @click="goBack"
        >
          <template #icon-left>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </template>
          Go Back
        </BaseButton>
      </div>

      <!-- Quick Links -->
      <div class="mt-12">
        <p class="text-sm text-gray-500 mb-4">Atau coba link berikut:</p>
        <div class="flex flex-wrap gap-3 justify-center">
          <router-link
            to="/"
            class="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Home
          </router-link>
          <span class="text-gray-300">•</span>
          <router-link
            to="/admin/dashboard"
            class="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Admin Dashboard
          </router-link>
          <span class="text-gray-300">•</span>
          <router-link
            to="/admin/documents"
            class="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Documents
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BaseButton from '@/components/base/BaseButton.vue';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>