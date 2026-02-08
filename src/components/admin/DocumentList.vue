<template>
  <div class="w-full">
    <BaseCard>
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Dokumen</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ loading ? 'Loading...' : `${totalDocuments} dokumen tersedia` }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Search -->
            <BaseInput
              v-model="searchQuery"
              placeholder="Cari dokumen..."
              size="sm"
              show-clear
              class="w-64"
            >
              <template #prefix>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </template>
            </BaseInput>
            
            <!-- Filter by Type -->
            <select 
              v-model="filterType"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Tipe</option>
              <option value="pdf">PDF</option>
              <option value="text">Text/DOCX</option>
            </select>

            <!-- Refresh Button -->
            <button
              @click="fetchDocuments"
              :disabled="loading"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              title="Refresh"
            >
              <svg 
                class="w-5 h-5" 
                :class="{ 'animate-spin': loading }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <BaseLoader type="spinner" :size="40" color="blue" />
      </div>

      <!-- Document List -->
      <div v-else-if="filteredDocuments.length > 0" class="divide-y divide-gray-200">
        <div
          v-for="doc in filteredDocuments"
          :key="doc.id"
          class="flex items-center justify-between p-4 hover:bg-gray-50 transition group"
        >
          <div class="flex items-center space-x-4 flex-1 min-w-0">
            <!-- Icon -->
            <div :class="getDocTypeClass(doc.type)" class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">{{ doc.name }}</h4>
              <div class="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <span class="uppercase">{{ doc.type }}</span>
                <span>•</span>
                <span>{{ doc.chunks }} chunks</span>
                <span>•</span>
                <span>{{ formatDate(doc.uploaded_at) }}</span>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center">
              <span :class="getStatusClass(doc.status)" class="px-2.5 py-1 text-xs font-medium rounded-full">
                {{ doc.status }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition">
            <button
              @click="deleteDocument(doc.id, doc.name)"
              :disabled="deleting === doc.id"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
              title="Delete"
            >
              <BaseLoader v-if="deleting === doc.id" type="spinner" :size="20" color="red" />
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState 
        v-else
        title="Tidak ada dokumen"
        description="Belum ada dokumen yang diupload atau dokumen tidak ditemukan"
        icon="document"
      />

      <!-- Pagination -->
      <template #footer v-if="filteredDocuments.length > 0">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Menampilkan {{ filteredDocuments.length }} dari {{ totalDocuments }} dokumen
          </p>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="ghost"
              size="sm"
              @click="loadMore"
              :disabled="loading || filteredDocuments.length >= totalDocuments"
              v-if="filteredDocuments.length < totalDocuments"
            >
              Load More
            </BaseButton>
          </div>
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseCard from '../base/BaseCard.vue';
import BaseInput from '../base/BaseInput.vue';
import BaseButton from '../base/BaseButton.vue';
import BaseLoader from '../base/BaseLoader.vue';
import EmptyState from '../common/EmptyState.vue';
import adminApi from '@/services/adminApi';

// Define emits
const emit = defineEmits(['document-deleted', 'delete-error']);

// State
const documents = ref([]);
const searchQuery = ref('');
const filterType = ref('all');
const loading = ref(false);
const deleting = ref(null);
const totalDocuments = ref(0);
const currentPage = ref(1);
const itemsPerPage = 100;

// Computed
const filteredDocuments = computed(() => {
  let filtered = documents.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(query)
    );
  }

  // Filter by type
  if (filterType.value !== 'all') {
    filtered = filtered.filter(doc => doc.type === filterType.value);
  }

  return filtered;
});

// Methods
const fetchDocuments = async () => {
  try {
    loading.value = true;
    
    const result = await adminApi.getDocuments(currentPage.value, itemsPerPage);
    
    if (result.success) {
      documents.value = result.data.documents || [];
      totalDocuments.value = result.data.total || 0;
    } else {
      console.error('Failed to fetch documents:', result.error);
      emit('delete-error', result.error || 'Failed to load documents');
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    emit('delete-error', 'Failed to load documents');
  } finally {
    loading.value = false;
  }
};

const deleteDocument = async (docId, docName) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus "${docName}"?`)) {
    return;
  }

  try {
    deleting.value = docId;
    
    const result = await adminApi.deleteDocument(docId);
    
    if (result.success) {
      // Remove from local state
      documents.value = documents.value.filter(doc => doc.id !== docId);
      totalDocuments.value--;
      
      // Emit success event
      emit('document-deleted', docId);
      
      // Show success message (optional)
      console.log('Document deleted successfully');
    } else {
      emit('delete-error', result.error || 'Failed to delete document');
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    emit('delete-error', 'Failed to delete document');
  } finally {
    deleting.value = null;
  }
};

const loadMore = async () => {
  currentPage.value++;
  await fetchDocuments();
};

const getDocTypeClass = (type) => {
  const classes = {
    pdf: 'bg-red-500',
    text: 'bg-blue-500',
    docx: 'bg-blue-500',
    doc: 'bg-blue-500'
  };
  return classes[type] || 'bg-gray-500';
};

const getStatusClass = (status) => {
  const classes = {
    'Completed': 'bg-green-100 text-green-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Failed': 'bg-red-100 text-red-800',
    'Pending': 'bg-yellow-100 text-yellow-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'N/A';
  }
};

// Lifecycle
onMounted(() => {
  fetchDocuments();
});
</script>