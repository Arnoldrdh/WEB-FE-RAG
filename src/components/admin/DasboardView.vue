<template>
  <AdminLayout>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">Selamat datang kembali, {{ userName }}!</p>
      </div>
      <button
        @click="refreshData"
        :disabled="isLoading"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
      >
        <svg class="w-4 h-4 inline-block mr-2" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !stats.totalDocuments" class="flex items-center justify-center py-12">
      <BaseLoader type="spinner" color="blue" text="Loading dashboard..." />
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Total Documents -->
        <BaseCard padding="md" hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Dokumen</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalDocuments }}</p>
              <p class="text-xs text-green-600 mt-2 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +{{ stats.newDocumentsToday }} hari ini
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </BaseCard>

        <!-- Processing -->
        <BaseCard padding="md" hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Processing</p>
              <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.processing }}</p>
              <p class="text-xs text-gray-500 mt-2">
                {{ calculatePercentage(stats.processing, stats.totalDocuments) }}% dari total
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </BaseCard>

        <!-- Completed -->
        <BaseCard padding="md" hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.completed }}</p>
              <p class="text-xs text-gray-500 mt-2">
                {{ calculatePercentage(stats.completed, stats.totalDocuments) }}% dari total
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </BaseCard>

        <!-- Failed -->
        <BaseCard padding="md" hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Failed</p>
              <p class="text-3xl font-bold text-red-600 mt-2">{{ stats.failed }}</p>
              <p class="text-xs text-gray-500 mt-2">
                {{ calculatePercentage(stats.failed, stats.totalDocuments) }}% dari total
              </p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Document Status Progress -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Status Overview -->
        <BaseCard title="Document Status" variant="elevated">
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Processed</span>
                <span class="text-sm font-semibold text-gray-900">
                  {{ calculatePercentage(stats.completed, stats.totalDocuments) }}%
                </span>
              </div>
              <ProgressBar 
                :value="stats.completed" 
                :max="stats.totalDocuments" 
                color="green" 
                size="md" 
              />
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Processing</span>
                <span class="text-sm font-semibold text-gray-900">
                  {{ calculatePercentage(stats.processing, stats.totalDocuments) }}%
                </span>
              </div>
              <ProgressBar 
                :value="stats.processing" 
                :max="stats.totalDocuments" 
                color="blue" 
                size="md" 
                animated 
              />
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Failed</span>
                <span class="text-sm font-semibold text-gray-900">
                  {{ calculatePercentage(stats.failed, stats.totalDocuments) }}%
                </span>
              </div>
              <ProgressBar 
                :value="stats.failed" 
                :max="stats.totalDocuments" 
                color="red" 
                size="md" 
              />
            </div>
          </div>
        </BaseCard>

        <!-- Storage Usage -->
        <BaseCard title="Storage Usage" variant="elevated">
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Total Storage</span>
                <span class="text-sm text-gray-600">{{ stats.storageUsed }} / {{ stats.storageLimit }}</span>
              </div>
              <ProgressBar 
                :value="parseStorageValue(stats.storageUsed)" 
                :max="parseStorageValue(stats.storageLimit)" 
                color="gradient" 
                size="lg" 
              />
            </div>

            <!-- Storage by Type -->
            <div class="grid grid-cols-3 gap-4 mt-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="text-xs text-gray-600">PDF</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ stats.storageByType.pdf }}</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="text-xs text-gray-600">DOCX</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ stats.storageByType.docx }}</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="text-xs text-gray-600">Others</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ stats.storageByType.others }}</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Recent Documents & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Documents -->
        <div class="lg:col-span-2">
          <BaseCard title="Recent Documents" variant="elevated">
            <template #header-actions>
              <router-link
                to="/admin/documents"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </router-link>
            </template>

            <div class="space-y-3">
              <div
                v-for="doc in recentDocuments"
                :key="doc.id"
                class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <div :class="getDocStatusIcon(doc.status)" class="w-10 h-10 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ doc.name }}</p>
                    <p class="text-xs text-gray-500">{{ doc.size }} • {{ formatDate(doc.uploadedAt) }}</p>
                  </div>
                </div>
                <span :class="getStatusBadgeClass(doc.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ doc.status }}
                </span>
              </div>

              <EmptyState
                v-if="recentDocuments.length === 0"
                title="No Documents Yet"
                description="Upload your first document to get started"
                icon="document"
              />
            </div>
          </BaseCard>
        </div>

        <!-- Quick Actions -->
        <div>
          <BaseCard title="Quick Actions" variant="elevated">
            <div class="space-y-3">
              <BaseButton variant="primary" block @click="goToUpload">
                <template #icon-left>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </template>
                Upload Document
              </BaseButton>
              
              <BaseButton variant="outline" block @click="goToDocuments">
                <template #icon-left>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </template>
                Manage Documents
              </BaseButton>
              
              <BaseButton variant="ghost" block @click="refreshData">
                <template #icon-left>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </template>
                Refresh Data
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ingestApi from '@/services/ingestApi';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import ProgressBar from '@/components/admin/ProgressBar.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const router = useRouter();
const isLoading = ref(false);
const userName = ref('Admin');

// Stats with dummy data (will be replaced with API)
const stats = ref({
  totalDocuments: 0,
  processing: 0,
  completed: 0,
  failed: 0,
  newDocumentsToday: 0,
  storageUsed: '0 GB',
  storageLimit: '10 GB',
  storageByType: {
    pdf: '0 MB',
    docx: '0 MB',
    others: '0 MB'
  }
});

const recentDocuments = ref([]);

onMounted(() => {
  fetchDashboardData();
});

const fetchDashboardData = async () => {
  isLoading.value = true;
  
  try {
    // Try to fetch from API
    const result = await ingestApi.getStats();
    
    if (result.success) {
      // Map API response to stats
      stats.value = {
        totalDocuments: result.data.total || 0,
        processing: result.data.processing || 0,
        completed: result.data.completed || 0,
        failed: result.data.failed || 0,
        newDocumentsToday: result.data.new_today || 0,
        storageUsed: result.data.storage_used || '0 GB',
        storageLimit: result.data.storage_limit || '10 GB',
        storageByType: result.data.storage_by_type || {
          pdf: '0 MB',
          docx: '0 MB',
          others: '0 MB'
        }
      };
    } else {
      // Use dummy data if API fails
      useDummyData();
    }
    
    // Fetch recent documents
    const docsResult = await ingestApi.getDocuments(1, 5);
    if (docsResult.success) {
      recentDocuments.value = docsResult.data.documents || [];
    } else {
      useDummyDocuments();
    }
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    useDummyData();
    useDummyDocuments();
  } finally {
    isLoading.value = false;
  }
};

const useDummyData = () => {
  console.log('📊 Using dummy data for dashboard');
  stats.value = {
    totalDocuments: 156,
    processing: 8,
    completed: 142,
    failed: 6,
    newDocumentsToday: 12,
    storageUsed: '2.4 GB',
    storageLimit: '10 GB',
    storageByType: {
      pdf: '1.2 GB',
      docx: '800 MB',
      others: '400 MB'
    }
  };
};

const useDummyDocuments = () => {
  console.log('📄 Using dummy documents for dashboard');
  recentDocuments.value = [
    {
      id: 1,
      name: 'Product_Documentation.pdf',
      size: '2.5 MB',
      status: 'Completed',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: 2,
      name: 'User_Manual_v2.docx',
      size: '1.8 MB',
      status: 'Processing',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
      id: 3,
      name: 'API_Reference.pdf',
      size: '3.2 MB',
      status: 'Completed',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 120)
    },
    {
      id: 4,
      name: 'Technical_Specs.xlsx',
      size: '890 KB',
      status: 'Failed',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 180)
    },
    {
      id: 5,
      name: 'Meeting_Notes.txt',
      size: '45 KB',
      status: 'Completed',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 240)
    }
  ];
};

const refreshData = () => {
  fetchDashboardData();
};

const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

const parseStorageValue = (storage) => {
  // Parse "2.4 GB" to numeric value in GB
  const match = storage.match(/([\d.]+)\s*(GB|MB)/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2];
  return unit === 'GB' ? value : value / 1024;
};

const getDocStatusIcon = (status) => {
  const classes = {
    'Completed': 'bg-green-500',
    'Processing': 'bg-blue-500',
    'Failed': 'bg-red-500',
    'Pending': 'bg-yellow-500'
  };
  return classes[status] || 'bg-gray-500';
};

const getStatusBadgeClass = (status) => {
  const classes = {
    'Completed': 'bg-green-100 text-green-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Failed': 'bg-red-100 text-red-800',
    'Pending': 'bg-yellow-100 text-yellow-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000 / 60);
  
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} minutes ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return new Date(date).toLocaleDateString('id-ID');
};

const goToUpload = () => {
  router.push('/admin/documents');
};

const goToDocuments = () => {
  router.push('/admin/documents');
};
</script>