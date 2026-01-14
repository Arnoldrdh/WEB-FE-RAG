<template>
  <AdminLayout>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-1">Selamat datang kembali, Admin!</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <BaseCard padding="md" hoverable>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Dokumen</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalDocuments }}</p>
            <p class="text-xs text-green-600 mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +12% dari bulan lalu
            </p>
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
            <p class="text-sm font-medium text-gray-600">Total Query</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalQueries }}</p>
            <p class="text-xs text-green-600 mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +23% dari bulan lalu
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
      </BaseCard>

      <BaseCard padding="md" hoverable>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Users</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.activeUsers }}</p>
            <p class="text-xs text-green-600 mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +8% dari bulan lalu
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </BaseCard>

      <BaseCard padding="md" hoverable>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg Response Time</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.avgResponseTime }}s</p>
            <p class="text-xs text-red-600 mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              +0.3s dari bulan lalu
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Query Trends -->
      <BaseCard title="Query Trends" variant="elevated">
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-sm">Chart will be implemented here</p>
            <p class="text-xs text-gray-400 mt-1">(Using Chart.js or similar)</p>
          </div>
        </div>
      </BaseCard>

      <!-- Document Status -->
      <BaseCard title="Document Status" variant="elevated">
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Processed</span>
              <span class="text-sm font-semibold text-gray-900">85%</span>
            </div>
            <ProgressBar :value="85" color="green" size="md" />
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Processing</span>
              <span class="text-sm font-semibold text-gray-900">10%</span>
            </div>
            <ProgressBar :value="10" color="blue" size="md" animated />
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Failed</span>
              <span class="text-sm font-semibold text-gray-900">5%</span>
            </div>
            <ProgressBar :value="5" color="red" size="md" />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity -->
      <div class="lg:col-span-2">
        <BaseCard title="Recent Activity" variant="elevated">
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
              <div :class="getActivityIconClass(activity.type)" class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActivityIcon(activity.type)" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTime(activity.time) }}</p>
              </div>
            </div>
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
            
            <BaseButton variant="ghost" block>
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </template>
              View Analytics
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import ProgressBar from '@/components/admin/ProggressBar.vue';

const router = useRouter();

const stats = ref({
  totalDocuments: 156,
  totalQueries: 2847,
  activeUsers: 342,
  avgResponseTime: 1.8
});

const recentActivities = ref([
  {
    id: 1,
    type: 'upload',
    title: 'New document uploaded',
    description: 'Product_Manual_v2.pdf was successfully processed',
    time: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: 2,
    type: 'query',
    title: 'High query volume',
    description: '50+ queries in the last hour',
    time: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: 3,
    type: 'user',
    title: 'New user registered',
    description: 'john.doe@example.com joined',
    time: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 4,
    type: 'error',
    title: 'Processing failed',
    description: 'Document_XYZ.docx failed to process',
    time: new Date(Date.now() - 1000 * 60 * 45)
  }
]);

const getActivityIconClass = (type) => {
  const classes = {
    upload: 'bg-blue-500',
    query: 'bg-green-500',
    user: 'bg-purple-500',
    error: 'bg-red-500'
  };
  return classes[type] || 'bg-gray-500';
};

const getActivityIcon = (type) => {
  const icons = {
    upload: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    query: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    error: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };
  return icons[type] || '';
};

const formatTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60);
  
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} minutes ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
};

const goToUpload = () => {
  router.push('/admin/documents');
};

const goToDocuments = () => {
  router.push('/admin/documents');
};
</script>