<template>
  <div class="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md hover:border-teal-200 transition group cursor-pointer">
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-3 flex-1">
        <!-- Document Icon -->
        <div class="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <!-- Document Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2">
            <h4 class="text-sm font-medium text-gray-900 truncate">{{ source.title }}</h4>
            <span v-if="source.confidence" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
              {{ Math.round(source.confidence * 100) }}%
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Halaman {{ source.page }}</p>
        </div>
      </div>

      <!-- Download Button -->
      <button
        @click="handleDownload"
        class="ml-2 p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download dokumen"
        :disabled="isDownloading"
      >
        <svg v-if="!isDownloading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <svg v-else class="w-5 h-5 animate-spin text-teal-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ragApi from '@/services/ragApi';

const props = defineProps({
  source: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['download-start', 'download-success', 'download-error']);

const isDownloading = ref(false);

const handleDownload = async () => {
  if (isDownloading.value) {
    console.log('[SourceReference] Download already in progress, skipping');
    return;
  }
  
  isDownloading.value = true;
  
  try {
    console.log('[SourceReference] Starting download for:', props.source.title);
    
    emit('download-start', props.source);
    
    const documentId = props.source.document_id || props.source.id;
    
    const result = await ragApi.downloadDocument(documentId, props.source.title);
    
    if (result.success) {
      console.log('[SourceReference] Download successful:', props.source.title);
      emit('download-success', { source: props.source, message: 'Document downloaded successfully' });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('[SourceReference] Download failed:', error.message);
    emit('download-error', { source: props.source, error: error.message || error });
    alert(`Gagal mengunduh dokumen: ${error.message || 'Unknown error'}`);
  } finally {
    isDownloading.value = false;
  }
};
</script>

<style scoped>
.group:hover button {
  opacity: 1;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>