<template>
  <AdminLayout>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <button
        @click="refreshData"
        :disabled="isLoading"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center space-x-2"
      >
        <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Refresh</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !stats.totalDocuments" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Loading dashboard data...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Main Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <BaseCard padding="md" hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Documents</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalDocuments }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </BaseCard>

        <BaseCard padding="md" hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Processing</p>
              <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.processing }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </BaseCard>

        <BaseCard padding="md" hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.completed }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </BaseCard>

        <BaseCard padding="md" hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Failed</p>
              <p class="text-3xl font-bold text-red-600 mt-2">{{ stats.failed }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Storage Usage -->
      <div class="grid grid-cols-1 gap-6 mb-6">
        <BaseCard title="Storage Usage" variant="elevated">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Space Used</span>
              <span class="text-lg font-bold text-gray-900">
                {{ stats.storageUsed }} / {{ stats.storageLimit }}
              </span>
            </div>
            <ProgressBar 
              :value="parseStorageValue(stats.storageUsed)" 
              :max="parseStorageValue(stats.storageLimit)" 
              color="gradient" 
              size="lg" 
            />
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">{{ calculateStoragePercentage() }}% used</span>
              <span class="text-gray-600">{{ calculateRemainingStorage() }} free</span>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Recent Activity / Upload Section -->
      <BaseCard title="Upload Documents" variant="elevated">
        <DocumentUpload 
          @upload-complete="handleUploadComplete"
          @upload-error="handleUploadError"
        />
      </BaseCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ingestApi from '@/services/ingestApi';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import ProgressBar from '@/components/admin/ProggressBar.vue';
import DocumentUpload from '@/components/admin/DocumentUpload.vue';

const isLoading = ref(false);

const stats = ref({
  totalDocuments: 0,
  processing: 0,
  completed: 0,
  failed: 0,
  storageUsed: '0 GB',
  storageLimit: '10 GB'
});

onMounted(() => {
  fetchDashboardData();
});

const fetchDashboardData = async () => {
  isLoading.value = true;
  
  try {
    const result = await ingestApi.getStats();
    
    if (result.success) {
      stats.value = {
        totalDocuments: result.data.total || 0,
        processing: result.data.processing || 0,
        completed: result.data.completed || 0,
        failed: result.data.failed || 0,
        storageUsed: result.data.storage_used || '0 GB',
        storageLimit: result.data.storage_limit || '10 GB'
      };
    } else {
      // Use dummy data if API not ready
      useDummyData();
    }
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    useDummyData();
  } finally {
    isLoading.value = false;
  }
};

const useDummyData = () => {
  console.log('Using dummy data');
  stats.value = {
    totalDocuments: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    storageUsed: '0 GB',
    storageLimit: '10 GB'
  };
};

const refreshData = () => {
  fetchDashboardData();
};

const parseStorageValue = (storage) => {
  const match = storage.match(/([\d.]+)\s*(GB|MB)/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2];
  return unit === 'GB' ? value : value / 1024;
};

const calculateStoragePercentage = () => {
  const used = parseStorageValue(stats.value.storageUsed);
  const limit = parseStorageValue(stats.value.storageLimit);
  return limit > 0 ? Math.round((used / limit) * 100) : 0;
};

const calculateRemainingStorage = () => {
  const used = parseStorageValue(stats.value.storageUsed);
  const limit = parseStorageValue(stats.value.storageLimit);
  const remaining = limit - used;
  return remaining > 0 ? `${remaining.toFixed(1)} GB` : '0 GB';
};

const handleUploadComplete = (event) => {
  console.log(' Upload complete:', event);
  
  // Show success notification (you can add toast here)
  alert('Upload completed successfully!');
  
  // Refresh dashboard data
  refreshData();
};

const handleUploadError = (event) => {
  console.error(' Upload error:', event);
  
  // Show error notification
  alert(`Upload failed: ${event.error}`);
};
</script>