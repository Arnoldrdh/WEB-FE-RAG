<template>
  <AdminLayout>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Document Management</h1>
      <p class="text-gray-600 mt-1">Upload dan kelola dokumen untuk knowledge base</p>
    </div>

    <!-- Alert Messages -->
    <ErrorMessage
      v-if="uploadSuccess"
      type="success"
      title="Upload Berhasil"
      message="Dokumen berhasil diupload dan sedang diproses"
      closable
      @close="uploadSuccess = false"
      class="mb-6"
    />

    <ErrorMessage
      v-if="uploadError"
      type="error"
      title="Upload Gagal"
      :message="uploadError"
      show-retry
      closable
      @retry="retryUpload"
      @close="uploadError = null"
      class="mb-6"
    />

    <ErrorMessage
      v-if="deleteError"
      type="error"
      title="Delete Gagal"
      :message="deleteError"
      closable
      @close="deleteError = null"
      class="mb-6"
    />

    <!-- Upload Section -->
    <div class="mb-6">
      <DocumentUpload @upload-complete="handleUploadComplete" />
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-600">Total Documents</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {{ statsLoading ? '-' : documentStats.total }}
          </p>
        </div>
      </BaseCard>
      
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-600">Processing</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">
            {{ statsLoading ? '-' : documentStats.processing }}
          </p>
        </div>
      </BaseCard>
      
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-600">Completed</p>
          <p class="text-3xl font-bold text-green-600 mt-2">
            {{ statsLoading ? '-' : documentStats.completed }}
          </p>
        </div>
      </BaseCard>
      
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-600">Failed</p>
          <p class="text-3xl font-bold text-red-600 mt-2">
            {{ statsLoading ? '-' : documentStats.failed }}
          </p>
        </div>
      </BaseCard>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="activeTab === tab.value
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="py-4 px-1 border-b-2 font-medium text-sm transition"
          >
            {{ tab.label }}
            <span
              v-if="tab.count !== undefined"
              :class="activeTab === tab.value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Document List -->
    <DocumentList 
      v-if="activeTab === 'all'" 
      @document-deleted="handleDocumentDeleted"
      @delete-error="handleDeleteError"
    />

    <!-- Processing Queue -->
    <div v-else-if="activeTab === 'processing'">
      <BaseCard title="Processing Queue" variant="elevated">
        <EmptyState
          title="No Processing Documents"
          description="Tidak ada dokumen yang sedang diproses"
          icon="check"
        />
      </BaseCard>
    </div>

    <!-- Failed Documents -->
    <div v-else-if="activeTab === 'failed'">
      <BaseCard title="Failed Documents" variant="elevated">
        <EmptyState
          title="No Failed Documents"
          description="Semua dokumen berhasil diproses"
          icon="check"
        />
      </BaseCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import DocumentUpload from '@/components/admin/DocumentUpload.vue';
import DocumentList from '@/components/admin/DocumentList.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import adminApi from '@/services/adminApi';

const activeTab = ref('all');
const uploadSuccess = ref(false);
const uploadError = ref(null);
const deleteError = ref(null);
const statsLoading = ref(false);

const documentStats = ref({
  total: 0,
  processing: 0,
  completed: 0,
  failed: 0
});

const tabs = computed(() => [
  { 
    label: 'All Documents', 
    value: 'all', 
    count: documentStats.value.total 
  },
  { 
    label: 'Processing', 
    value: 'processing', 
    count: documentStats.value.processing 
  },
  { 
    label: 'Failed', 
    value: 'failed', 
    count: documentStats.value.failed 
  }
]);

// Fetch stats from API
const fetchStats = async () => {
  try {
    statsLoading.value = true;
    const result = await adminApi.getStats();
    
    if (result.success) {
      documentStats.value = {
        total: result.data.total || 0,
        processing: result.data.processing || 0,
        completed: result.data.completed || 0,
        failed: result.data.failed || 0
      };
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  } finally {
    statsLoading.value = false;
  }
};

const handleUploadComplete = (files) => {
  uploadSuccess.value = true;
  
  // Refresh stats after upload
  fetchStats();
  
  setTimeout(() => {
    uploadSuccess.value = false;
  }, 5000);
};

const handleDocumentDeleted = () => {
  // Refresh stats after delete
  fetchStats();
};

const handleDeleteError = (error) => {
  deleteError.value = error;
};

const retryUpload = () => {
  uploadError.value = null;
};

// Load stats on mount
onMounted(() => {
  fetchStats();
});
</script>
