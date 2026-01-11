<template>
  <div class="w-full">
    <BaseCard>
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Dokumen</h3>
            <p class="text-sm text-gray-500 mt-1">{{ documents.length }} dokumen tersedia</p>
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
            
            <!-- Filter -->
            <select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              <option value="all">Semua Tipe</option>
              <option value="pdf">PDF</option>
              <option value="doc">DOC/DOCX</option>
              <option value="excel">Excel</option>
              <option value="ppt">PowerPoint</option>
            </select>
          </div>
        </div>
      </template>

      <!-- Document List -->
      <div v-if="filteredDocuments.length > 0" class="divide-y divide-gray-200">
        <div
          v-for="doc in paginatedDocuments"
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
                <span>{{ doc.size }}</span>
                <span>•</span>
                <span>{{ doc.pages }} halaman</span>
                <span>•</span>
                <span>{{ formatDate(doc.uploadedAt) }}</span>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center space-x-2">
              <span :class="getStatusClass(doc.status)" class="px-2.5 py-1 text-xs font-medium rounded-full">
                {{ doc.status }}
              </span>
              <ProgressBar
                v-if="doc.status === 'Processing'"
                :value="doc.progress"
                :max="100"
                size="sm"
                color="blue"
                class="w-24"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition">
            <button
              @click="viewDocument(doc.id)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="View"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              @click="downloadDocument(doc.id)"
              class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
              title="Download"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              @click="deleteDocument(doc.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState v-else
        title="Tidak ada dokumen"
        description="Belum ada dokumen yang diupload"
      />

      <!-- Pagination -->
      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Menampilkan {{ startIndex + 1 }}-{{ endIndex }} dari {{ filteredDocuments.length }} dokumen
          </p>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="ghost"
              size="sm"
              @click="previousPage"
              :disabled="currentPage === 1"
            >
              Previous
            </BaseButton>
            <div class="flex space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                class="w-8 h-8 rounded-lg text-sm font-medium transition"
              >
                {{ page }}
              </button>
            </div>
            <BaseButton
              variant="ghost"
              size="sm"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Next
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
import BaseInput from '../base/BaseInput.vue';
import BaseButton from '../base/BaseButton.vue';
import ProgressBar from './ProgressBar.vue';
import EmptyState from '../common/EmptyState.vue';

// Sample data - replace with API call
const documents = ref([
  {
    id: 1,
    name: 'Product Documentation.pdf',
    type: 'pdf',
    size: '2.5 MB',
    pages: 45,
    status: 'Completed',
    progress: 100,
    uploadedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'User Manual.docx',
    type: 'doc',
    size: '1.8 MB',
    pages: 32,
    status: 'Processing',
    progress: 65,
    uploadedAt: new Date('2024-01-14')
  },
  // Add more sample data...
]);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredDocuments = computed(() => {
  if (!searchQuery.value) return documents.value;
  
  const query = searchQuery.value.toLowerCase();
  return documents.value.filter(doc =>
    doc.name.toLowerCase().includes(query)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredDocuments.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, filteredDocuments.value.length);
});

const paginatedDocuments = computed(() => {
  return filteredDocuments.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const getDocTypeClass = (type) => {
  const classes = {
    pdf: 'bg-red-500',
    doc: 'bg-blue-500',
    excel: 'bg-green-500',
    ppt: 'bg-orange-500'
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

const viewDocument = (id) => {
  console.log('View document:', id);
  // TODO: Implement view functionality
};

const downloadDocument = (id) => {
  console.log('Download document:', id);
  // TODO: Implement download functionality
};

const deleteDocument = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
    documents.value = documents.value.filter(doc => doc.id !== id);
  }
};
</script>