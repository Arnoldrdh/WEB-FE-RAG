<template>
  <div class="w-full">
    <BaseCard variant="elevated">
      <!-- Upload Mode Selector -->
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Upload Dokumen</h3>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              v-model="uploadMode"
              value="sync"
              class="w-4 h-4 text-blue-600"
              :disabled="isUploading"
            />
            <span class="text-sm font-medium text-gray-700">Sync</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              v-model="uploadMode"
              value="async"
              class="w-4 h-4 text-blue-600"
              :disabled="isUploading"
            />
            <span class="text-sm font-medium text-gray-700">Async (Background)</span>
          </label>
        </div>
      </div>

      <!-- Upload Area -->
      <div
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="uploadAreaClasses"
        class="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200"
        :style="{ cursor: isUploading ? 'not-allowed' : 'pointer' }"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          accept=".pdf,.txt"
          @change="handleFileSelect"
          class="hidden"
          :disabled="isUploading"
        />

        <!-- Empty State -->
        <div v-if="!isUploading && files.length === 0">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Upload File</h3>
          <p class="text-sm text-gray-500 mb-4">Drag & drop atau klik untuk browse</p>
          <p class="text-xs text-gray-400">PDF, TXT • Max 50MB</p>
        </div>

        <!-- File List Preview -->
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
              class="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="space-y-6">
          <!-- Mode: Async with Polling -->
          <div v-if="uploadMode === 'async' && taskId" class="space-y-4">
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-3 flex-1">
                  <div :class="getStatusIconClass(taskStatus)" class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg v-if="taskStatus === 'completed'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else-if="taskStatus === 'failed'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">Processing Files...</p>
                    <p class="text-xs text-gray-600 mt-1">{{ processedFiles }} / {{ totalFiles }} files processed</p>
                  </div>
                </div>
                <span :class="getStatusBadgeClass(taskStatus)" class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2">
                  {{ getStatusLabel(taskStatus) }}
                </span>
              </div>

              <!-- Progress Bar -->
              <ProgressBar 
                :value="processedFiles" 
                :max="totalFiles" 
                :color="getProgressColor(taskStatus)"
                size="md" 
                :animated="taskStatus === 'processing'"
              />

              <div class="mt-3 flex items-center justify-between text-xs">
                <span class="text-gray-500">Task ID: {{ taskId.substring(0, 8) }}...</span>
                <span class="font-medium text-gray-700">{{ Math.round((processedFiles / totalFiles) * 100) }}%</span>
              </div>
            </div>
          </div>

          <!-- Mode: Sync (direct upload) -->
          <div v-else class="space-y-4">
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-sm font-medium text-gray-900">Uploading and processing files...</p>
              </div>
              <ProgressBar :value="50" :max="100" color="blue" size="md" animated />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600">
            <span v-if="!isUploading">{{ files.length }} file(s) selected</span>
            <span v-else-if="uploadMode === 'async'">Processing in background...</span>
            <span v-else>Uploading...</span>
          </p>
          <div class="flex space-x-3">
            <BaseButton
              v-if="isUploading && uploadMode === 'async'"
              variant="ghost"
              @click="stopPolling"
            >
              Stop Tracking
            </BaseButton>
            <template v-else-if="!isUploading">
              <BaseButton
                variant="ghost"
                @click="clearFiles"
                :disabled="files.length === 0"
              >
                Clear
              </BaseButton>
              <BaseButton
                variant="primary"
                @click="uploadFiles"
                :disabled="files.length === 0"
              >
                <template #icon-left>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </template>
                Upload ({{ uploadMode === 'sync' ? 'Sync' : 'Async' }})
              </BaseButton>
            </template>
          </div>
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ingestApi from '@/services/ingestApi';
import BaseCard from '../base/BaseCard.vue';
import BaseButton from '../base/BaseButton.vue';
import ProgressBar from './ProggressBar.vue';

const fileInput = ref(null);
const files = ref([]);
const isDragging = ref(false);
const isUploading = ref(false);
const uploadMode = ref('async'); // 'sync' or 'async'

// Async tracking
const taskId = ref(null);
const taskStatus = ref('pending');
const processedFiles = ref(0);
const totalFiles = ref(0);
const pollingInterval = ref(null);

const emit = defineEmits(['upload-complete', 'upload-error']);

const uploadAreaClasses = computed(() => {
  if (isUploading.value) {
    return 'border-gray-300 bg-gray-50 opacity-60';
  }
  return isDragging.value
    ? 'border-blue-500 bg-blue-50'
    : 'border-gray-300 hover:border-gray-400 bg-white cursor-pointer';
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
  if (!isUploading.value) {
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    addFiles(droppedFiles);
  }
};

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const validExtensions = /\.(pdf|txt)$/i;
    
    if (file.size > maxSize) {
      alert(`File ${file.name} terlalu besar. Max: 50MB.`);
      return false;
    }
    
    if (!validExtensions.test(file.name)) {
      alert(`File ${file.name} format tidak valid. Hanya PDF dan TXT yang diperbolehkan.`);
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
  
  try {
    if (uploadMode.value === 'sync') {
      await uploadSync();
    } else {
      await uploadAsync();
    }
  } catch (error) {
    console.error(' Upload error:', error);
    emit('upload-error', { error: error.message });
    isUploading.value = false;
  }
};

const uploadSync = async () => {
  console.log(' Starting sync upload...');
  
  const result = await ingestApi.uploadFiles(files.value);
  
  if (result.success) {
    console.log(' Sync upload complete:', result.data);
    
    emit('upload-complete', {
      mode: 'sync',
      result: result.data
    });
    
    // Clear after delay
    setTimeout(() => {
      clearFiles();
      isUploading.value = false;
    }, 2000);
  } else {
    throw new Error(result.error);
  }
};

const uploadAsync = async () => {
  console.log(' Starting async upload...');
  
  const result = await ingestApi.uploadFilesAsync(files.value);
  
  if (result.success) {
    taskId.value = result.data.task_id;
    totalFiles.value = result.data.queued || files.value.length;
    processedFiles.value = 0;
    taskStatus.value = 'processing';
    
    console.log(' Async upload started, task_id:', taskId.value);
    
    // Start polling
    startPolling();
  } else {
    throw new Error(result.error);
  }
};

const startPolling = () => {
  // Poll every 2 seconds
  pollingInterval.value = setInterval(async () => {
    try {
      const result = await ingestApi.getTaskStatus(taskId.value);
      
      if (result.success) {
        const status = result.data;
        
        processedFiles.value = status.processed || 0;
        totalFiles.value = status.total || totalFiles.value;
        
        console.log(` Progress: ${processedFiles.value}/${totalFiles.value}`);
        
        // Check if completed
        if (status.status === 'completed' || processedFiles.value >= totalFiles.value) {
          taskStatus.value = 'completed';
          stopPolling();
          
          emit('upload-complete', {
            mode: 'async',
            taskId: taskId.value,
            result: status
          });
          
          // Clear after delay
          setTimeout(() => {
            clearFiles();
            isUploading.value = false;
            taskId.value = null;
            taskStatus.value = 'pending';
          }, 3000);
        } else if (status.status === 'failed') {
          taskStatus.value = 'failed';
          stopPolling();
          
          emit('upload-error', {
            taskId: taskId.value,
            error: 'Task failed'
          });
          
          setTimeout(() => {
            isUploading.value = false;
            taskId.value = null;
            taskStatus.value = 'pending';
          }, 3000);
        }
      }
    } catch (error) {
      console.error(' Polling error:', error);
    }
  }, 2000);
};

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

const getStatusIconClass = (status) => {
  const classes = {
    'processing': 'bg-blue-500',
    'completed': 'bg-green-500',
    'failed': 'bg-red-500'
  };
  return classes[status] || 'bg-gray-500';
};

const getStatusBadgeClass = (status) => {
  const classes = {
    'processing': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status) => {
  const labels = {
    'processing': 'Processing',
    'completed': 'Completed',
    'failed': 'Failed',
    'pending': 'Pending'
  };
  return labels[status] || status;
};

const getProgressColor = (status) => {
  if (status === 'completed') return 'green';
  if (status === 'failed') return 'red';
  return 'blue';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Cleanup on unmount
import { onBeforeUnmount } from 'vue';

onBeforeUnmount(() => {
  stopPolling();
});
</script>