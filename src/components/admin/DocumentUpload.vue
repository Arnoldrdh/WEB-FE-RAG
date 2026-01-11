<template>
  <div class="w-full">
    <BaseCard title="Upload Dokumen" variant="elevated">
      <!-- Upload Area -->
      <div
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="uploadAreaClasses"
        class="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
          @change="handleFileSelect"
          class="hidden"
        />

        <div v-if="!isUploading && files.length === 0">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            Support for PDF, DOC, DOCX, TXT, XLSX, PPT, PPTX
          </p>
          <p class="text-xs text-gray-400">
            Maximum file size: 50MB per file
          </p>
        </div>

        <!-- File List -->
        <div v-else-if="files.length > 0 && !isUploading" class="space-y-3">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-left"
          >
            <div class="flex items-center space-x-3 flex-1 min-w-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <button
              @click.stop="removeFile(index)"
              class="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="space-y-4">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
            <BaseLoader type="spinner" :size="32" color="blue" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 mb-2">Uploading files...</p>
            <ProgressBar :value="uploadProgress" :max="100" />
            <p class="text-xs text-gray-500 mt-2">
              {{ uploadedCount }} of {{ totalFiles }} files uploaded
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600">
            {{ files.length }} file(s) selected
          </p>
          <div class="flex space-x-3">
            <BaseButton
              variant="ghost"
              @click="clearFiles"
              :disabled="files.length === 0 || isUploading"
            >
              Clear All
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="uploadFiles"
              :disabled="files.length === 0 || isUploading"
              :loading="isUploading"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </template>
              Upload Files
            </BaseButton>
          </div>
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseCard from '../base/BaseCard.vue';
import BaseButton from '../base/BaseButton.vue';
import BaseLoader from '../base/BaseLoader.vue';
import ProgressBar from './ProgressBar.vue';

const fileInput = ref(null);
const files = ref([]);
const isDragging = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadedCount = ref(0);
const totalFiles = ref(0);

const emit = defineEmits(['upload-complete']);

const uploadAreaClasses = computed(() => {
  return isDragging.value
    ? 'border-blue-500 bg-blue-50'
    : 'border-gray-300 hover:border-gray-400 bg-white';
});

const triggerFileInput = () => {
  if (!isUploading.value) {
    fileInput.value?.click();
  }
};

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files || []);
  addFiles(selectedFiles);
};

const handleDrop = (event) => {
  isDragging.value = false;
  const droppedFiles = Array.from(event.dataTransfer.files || []);
  addFiles(droppedFiles);
};

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum size is 50MB.`);
      return false;
    }
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt|xlsx|xls|ppt|pptx)$/i)) {
      alert(`File ${file.name} has invalid type.`);
      return false;
    }
    
    return true;
  });
  
  files.value.push(...validFiles);
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

const clearFiles = () => {
  files.value = [];
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadFiles = async () => {
  if (files.value.length === 0) return;
  
  isUploading.value = true;
  uploadProgress.value = 0;
  uploadedCount.value = 0;
  totalFiles.value = files.value.length;
  
  // TODO: Implement actual file upload with API
  // Simulate upload progress
  for (let i = 0; i < files.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    uploadedCount.value++;
    uploadProgress.value = Math.round((uploadedCount.value / totalFiles.value) * 100);
  }
  
  // Complete
  setTimeout(() => {
    isUploading.value = false;
    emit('upload-complete', files.value);
    clearFiles();
  }, 500);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
</script>