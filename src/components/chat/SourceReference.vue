<template>
  <div class="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition group cursor-pointer">
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-3 flex-1">
        <!-- Document Icon -->
        <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <!-- Document Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2">
            <h4 class="text-sm font-medium text-gray-900 truncate">{{ source.title }}</h4>
            <span v-if="source.confidence" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {{ Math.round(source.confidence * 100) }}%
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Halaman {{ source.page }}
          </p>
        </div>
      </div>

      <!-- Download Button -->
      <button 
        @click="handleDownload"
        class="ml-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition opacity-0 group-hover:opacity-100"
        title="Download dokumen"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    </div>

    <!-- Progress Bar (Optional - for future use) -->
    <div v-if="source.relevance" class="mt-2">
      <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>Relevansi</span>
        <span>{{ Math.round(source.relevance * 100) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          class="bg-blue-600 h-1.5 rounded-full transition-all"
          :style="{ width: `${source.relevance * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  source: {
    type: Object,
    required: true
  }
});

const handleDownload = () => {
  // TODO: Implement download functionality via API
  console.log('Download document:', this.source);
  alert(`Download functionality akan diimplementasikan untuk: ${this.source.title}`);
};
</script>