<template>
  <div class="w-full">
    <div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <h3 class="text-[0.9rem] font-semibold text-white/80">Upload Dokumen</h3>
        <div class="flex items-center gap-5">
          <label class="flex items-center gap-2 cursor-pointer text-[0.78rem] text-white/50">
            <input type="radio" v-model="uploadMode" value="sync" :disabled="isUploading" class="accent-teal-500 w-3.5 h-3.5"/>
            <span>Sync</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer text-[0.78rem] text-white/50">
            <input type="radio" v-model="uploadMode" value="async" :disabled="isUploading" class="accent-teal-500 w-3.5 h-3.5"/>
            <span>Async (Background)</span>
          </label>
        </div>
      </div>

      <!-- Drop zone -->
      <div
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
        :style="{ cursor: isUploading ? 'not-allowed' : 'pointer' }"
        :class="[
          'mx-5 my-4 border-[1.5px] border-dashed rounded-xl p-8 flex items-center justify-center min-h-[180px] transition-all duration-200',
          isDragging
            ? 'border-teal-500 bg-teal-500/[0.07]'
            : 'border-white/[0.12] hover:border-teal-500/40 hover:bg-teal-500/[0.03]',
          isUploading ? 'opacity-60' : ''
        ]"
      >
        <input ref="fileInput" type="file" multiple accept=".pdf,.txt" @change="handleFileSelect" class="hidden" :disabled="isUploading"/>

        <!-- Empty state -->
        <div v-if="!isUploading && files.length === 0" class="flex flex-col items-center gap-1">
          <div class="w-14 h-14 rounded-full flex items-center justify-center bg-teal-500/[0.12] text-teal-500 mb-3">
            <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <p class="text-[0.95rem] font-semibold text-white/70">Upload File</p>
          <p class="text-[0.78rem] text-white/35">Drag & drop atau klik untuk browse</p>
          <p class="text-[0.7rem] text-white/20 mt-1">PDF, TXT &bull; Max 50MB</p>
        </div>

        <!-- File list -->
        <div v-else-if="files.length > 0 && !isUploading" class="w-full flex flex-col gap-2" @click.stop>
          <div v-for="(file, index) in files" :key="index"
            class="flex items-center gap-3 px-3 py-2.5 bg-white/[0.05] border border-white/[0.07] rounded-[9px]">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-teal-500/[0.12] text-teal-400 shrink-0">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[0.8rem] font-medium text-white/80 truncate">{{ file.name }}</p>
              <p class="text-[0.7rem] text-white/30">{{ formatFileSize(file.size) }}</p>
            </div>
            <button @click.stop="removeFile(index)"
              class="p-1.5 rounded-md text-red-400/50 hover:text-red-400 hover:bg-red-500/[0.08] transition">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress -->
        <div v-if="isUploading" class="w-full" @click.stop>
          <!-- Async -->
          <div v-if="uploadMode === 'async' && taskId" class="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div :class="['w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0',
                  taskStatus === 'completed' ? 'bg-emerald-500/25' : taskStatus === 'failed' ? 'bg-red-500/25' : 'bg-blue-500/25']">
                  <svg v-if="taskStatus === 'completed'" width="16" height="16" fill="none" stroke="#34d399" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="taskStatus === 'failed'" width="16" height="16" fill="none" stroke="#f87171" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <div v-else class="w-4 h-4 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin"></div>
                </div>
                <div>
                  <p class="text-[0.82rem] font-medium text-white/75">Processing Files...</p>
                  <p class="text-[0.72rem] text-white/35">{{ processedFiles }} / {{ totalFiles }} files processed</p>
                </div>
              </div>
              <span :class="['text-[0.68rem] font-semibold px-2.5 py-0.5 rounded-full shrink-0',
                taskStatus === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                taskStatus === 'failed'    ? 'bg-red-500/15 text-red-400' :
                'bg-blue-500/15 text-blue-400']">
                {{ getStatusLabel(taskStatus) }}
              </span>
            </div>
            <ProgressBar :value="processedFiles" :max="totalFiles" :color="getProgressColor(taskStatus)" size="md" :animated="taskStatus === 'processing'"/>
            <div class="flex justify-between text-[0.68rem] text-white/25 mt-2">
              <span>Task ID: {{ taskId.substring(0, 8) }}...</span>
              <span>{{ Math.round((processedFiles / totalFiles) * 100) }}%</span>
            </div>
          </div>

          <!-- Sync -->
          <div v-else class="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 flex items-center justify-center shrink-0">
                <div class="w-5 h-5 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin"></div>
              </div>
              <p class="text-[0.82rem] font-medium text-white/70">Uploading and processing files...</p>
            </div>
            <ProgressBar :value="50" :max="100" color="blue" size="md" animated/>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.06]">
        <p class="text-[0.78rem] text-white/30">
          <span v-if="!isUploading">{{ files.length }} file(s) selected</span>
          <span v-else-if="uploadMode === 'async'">Processing in background...</span>
          <span v-else>Uploading...</span>
        </p>
        <div class="flex gap-2">
          <button v-if="isUploading && uploadMode === 'async'" @click="stopPolling"
            class="px-3.5 py-1.5 text-[0.78rem] font-medium text-white/45 bg-white/[0.05] border border-white/[0.08] rounded-lg hover:bg-white/[0.09] hover:text-white/70 transition">
            Stop Tracking
          </button>
          <template v-else-if="!isUploading">
            <button @click="clearFiles" :disabled="files.length === 0"
              class="px-3.5 py-1.5 text-[0.78rem] font-medium text-white/45 bg-white/[0.05] border border-white/[0.08] rounded-lg hover:bg-white/[0.09] hover:text-white/70 transition disabled:opacity-30 disabled:cursor-not-allowed">
              Clear
            </button>
            <button @click="uploadFiles" :disabled="files.length === 0"
              class="flex items-center gap-1.5 px-4 py-1.5 text-[0.78rem] font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg shadow-[0_2px_10px_rgba(13,148,136,0.2)] hover:opacity-88 transition disabled:opacity-35 disabled:cursor-not-allowed">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              Upload ({{ uploadMode === 'sync' ? 'Sync' : 'Async' }})
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ingestApi from '@/services/ingestApi';
import ProgressBar from './ProggressBar.vue';

const fileInput      = ref(null);
const files          = ref([]);
const isDragging     = ref(false);
const isUploading    = ref(false);
const uploadMode     = ref('async');
const taskId         = ref(null);
const taskStatus     = ref('pending');
const processedFiles = ref(0);
const totalFiles     = ref(0);
const pollingInterval = ref(null);

const emit = defineEmits(['upload-complete', 'upload-error']);

const triggerFileInput = () => { if (!isUploading.value) fileInput.value?.click(); };

const handleFileSelect = (event) => { addFiles(Array.from(event.target.files || [])); };

const handleDrop = (event) => {
  isDragging.value = false;
  if (!isUploading.value) addFiles(Array.from(event.dataTransfer.files || []));
};

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file => {
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) { alert(`File ${file.name} terlalu besar. Max: 50MB.`); return false; }
    if (!/\.(pdf|txt)$/i.test(file.name)) { alert(`File ${file.name} format tidak valid. Hanya PDF dan TXT.`); return false; }
    return true;
  });
  files.value.push(...validFiles);
};

const removeFile  = (index) => { files.value.splice(index, 1); };
const clearFiles  = () => { files.value = []; if (fileInput.value) fileInput.value.value = ''; };

const uploadFiles = async () => {
  if (files.value.length === 0) return;
  isUploading.value = true;
  try {
    if (uploadMode.value === 'sync') await uploadSync();
    else await uploadAsync();
  } catch (error) {
    emit('upload-error', { error: error.message });
    isUploading.value = false;
  }
};

const uploadSync = async () => {
  const result = await ingestApi.uploadFiles(files.value);
  if (result.success) {
    emit('upload-complete', { mode: 'sync', result: result.data });
    setTimeout(() => { clearFiles(); isUploading.value = false; }, 2000);
  } else throw new Error(result.error);
};

const uploadAsync = async () => {
  const result = await ingestApi.uploadFilesAsync(files.value);
  if (result.success) {
    taskId.value = result.data.task_id;
    totalFiles.value = result.data.queued || files.value.length;
    processedFiles.value = 0;
    taskStatus.value = 'processing';
    startPolling();
  } else throw new Error(result.error);
};

const startPolling = () => {
  pollingInterval.value = setInterval(async () => {
    try {
      const result = await ingestApi.getTaskStatus(taskId.value);
      if (result.success) {
        const status = result.data;
        processedFiles.value = status.processed || 0;
        totalFiles.value = status.total || totalFiles.value;
        if (status.status === 'completed' || processedFiles.value >= totalFiles.value) {
          taskStatus.value = 'completed'; stopPolling();
          emit('upload-complete', { mode: 'async', taskId: taskId.value, result: status });
          setTimeout(() => { clearFiles(); isUploading.value = false; taskId.value = null; taskStatus.value = 'pending'; }, 3000);
        } else if (status.status === 'failed') {
          taskStatus.value = 'failed'; stopPolling();
          emit('upload-error', { taskId: taskId.value, error: 'Task failed' });
          setTimeout(() => { isUploading.value = false; taskId.value = null; taskStatus.value = 'pending'; }, 3000);
        }
      }
    } catch (error) { console.error('Polling error:', error); }
  }, 2000);
};

const stopPolling = () => {
  if (pollingInterval.value) { clearInterval(pollingInterval.value); pollingInterval.value = null; }
};

const getStatusLabel    = (s) => ({ processing: 'Processing', completed: 'Completed', failed: 'Failed', pending: 'Pending' }[s] || s);
const getProgressColor  = (s) => ({ completed: 'green', failed: 'red' }[s] || 'blue');
const formatFileSize    = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => stopPolling());
</script>