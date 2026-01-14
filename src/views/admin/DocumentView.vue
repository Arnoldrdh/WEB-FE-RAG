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

    <!-- Upload Section -->
    <div class="mb-6">
      <DocumentUpload @upload-complete="handleUploadComplete" />
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-600">Total Documents</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ documentStats.total }}</p>
        </div>
      </BaseCard>
      
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-600">Processing</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ documentStats.processing }}</p>
        </div>
      </BaseCard>
      
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-600">Completed</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ documentStats.completed }}</p>
        </div>
      </BaseCard>
      
      <BaseCard padding="md">
        <div class="text-center">
          <p class="text-sm text-gray-600">Failed</p>
          <p class="text-3xl font-bold text-red-600 mt-2">{{ documentStats.failed }}</p>
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
              v-if="tab.count"
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
    <DocumentList v-if="activeTab === 'all'" />

    <!-- Processing Queue -->
    <div v-else-if="activeTab === 'processing'">
      <BaseCard title="Processing Queue" variant="elevated">
        <div class="space-y-4">
          <div
            v-for="doc in processingDocuments"
            :key="doc.id"
            class="p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <BaseLoader type="spinner" :size="24" color="blue" />
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ doc.name }}</h4>
                  <p class="text-xs text-gray-500 mt-0.5">{{ doc.size }} • Started {{ doc.startedAt }}</p>
                </div>
              </div>
              <span class="text-sm font-semibold text-blue-600">{{ doc.progress }}%</span>
            </div>
            <ProgressBar :value="doc.progress" color="blue" size="sm" animated />
            <p class="text-xs text-gray-600 mt-2">{{ doc.stage }}</p>
          </div>

          <EmptyState
            v-if="processingDocuments.length === 0"
            title="No Processing Documents"
            description="Tidak ada dokumen yang sedang diproses"
            icon="check"
          />
        </div>
      </BaseCard>
    </div>

    <!-- Failed Documents -->
    <div v-else-if="activeTab === 'failed'">
      <BaseCard title="Failed Documents" variant="elevated">
        <div class="space-y-4">
          <div
            v-for="doc in failedDocuments"
            :key="doc.id"
            class="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ doc.name }}</h4>
                  <p class="text-xs text-red-600 mt-1">{{ doc.error }}</p>
                  <p class="text-xs text-gray-500 mt-1">Failed at {{ doc.failedAt }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <BaseButton variant="ghost" size="sm" @click="retryDocument(doc.id)">
                  Retry
                </BaseButton>
                <BaseButton variant="danger" size="sm" @click="deleteDocument(doc.id)">
                  Delete
                </BaseButton>
              </div>
            </div>
          </div>

          <EmptyState
            v-if="failedDocuments.length === 0"
            title="No Failed Documents"
            description="Semua dokumen berhasil diproses"
            icon="check"
          />
        </div>
      </BaseCard>
    </div>

    <!-- Storage Usage -->
    <div class="mt-6">
      <BaseCard title="Storage Usage" variant="elevated">
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Documents</span>
              <span class="text-sm text-gray-600">2.4 GB / 10 GB</span>
            </div>
            <ProgressBar :value="24" color="gradient" size="lg" />
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="text-center">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="text-xs text-gray-600">PDF</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">1.2 GB</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-xs text-gray-600">DOCX</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">800 MB</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-xs text-gray-600">XLSX</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">300 MB</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-xs text-gray-600">Others</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">100 MB</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import DocumentUpload from '@/components/admin/DocumentUpload.vue';
import DocumentList from '@/components/admin/DocumentList.vue';
import ProgressBar from '@/components/admin/ProggressBar.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const activeTab = ref('all');
const uploadSuccess = ref(false);
const uploadError = ref(null);

const tabs = [
  { label: 'All Documents', value: 'all', count: 156 },
  { label: 'Processing', value: 'processing', count: 3 },
  { label: 'Failed', value: 'failed', count: 2 }
];

const documentStats = ref({
  total: 156,
  processing: 3,
  completed: 151,
  failed: 2
});

const processingDocuments = ref([
  {
    id: 1,
    name: 'Annual_Report_2024.pdf',
    size: '5.2 MB',
    progress: 65,
    stage: 'Extracting text and creating embeddings...',
    startedAt: '2 minutes ago'
  },
  {
    id: 2,
    name: 'Product_Catalog.xlsx',
    size: '2.8 MB',
    progress: 30,
    stage: 'Processing spreadsheet data...',
    startedAt: '5 minutes ago'
  },
  {
    id: 3,
    name: 'User_Guide_v3.docx',
    size: '1.5 MB',
    progress: 90,
    stage: 'Finalizing document processing...',
    startedAt: '1 minute ago'
  }
]);

const failedDocuments = ref([
  {
    id: 1,
    name: 'Corrupted_File.pdf',
    error: 'File is corrupted or unreadable',
    failedAt: '10 minutes ago'
  },
  {
    id: 2,
    name: 'Large_Document.docx',
    error: 'File size exceeds maximum limit (50MB)',
    failedAt: '1 hour ago'
  }
]);

const handleUploadComplete = (files) => {
  uploadSuccess.value = true;
  documentStats.value.processing += files.length;
  documentStats.value.total += files.length;
  
  setTimeout(() => {
    uploadSuccess.value = false;
  }, 5000);
};

const retryUpload = () => {
  // TODO: Implement retry logic
  uploadError.value = null;
};

const retryDocument = (id) => {
  // TODO: Implement retry document processing
  console.log('Retry document:', id);
};

const deleteDocument = (id) => {
  if (confirm('Are you sure you want to delete this document?')) {
    failedDocuments.value = failedDocuments.value.filter(doc => doc.id !== id);
    documentStats.value.failed--;
    documentStats.value.total--;
  }
};
</script>