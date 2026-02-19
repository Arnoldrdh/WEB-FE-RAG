<template>
  <div class="w-full">
    <div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h3 class="text-[0.9rem] font-semibold text-white/80">Dokumen</h3>
          <p class="text-[0.75rem] text-white/30 mt-0.5">
            {{ loading ? 'Loading...' : `${totalDocuments} dokumen tersedia` }}
          </p>
        </div>
        <div class="flex items-center gap-2.5">
          <!-- Search -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/25 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari dokumen..."
              class="w-52 pl-8 pr-8 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/70 text-[0.78rem] placeholder-white/20 outline-none focus:border-teal-500/50 focus:bg-white/[0.07] transition"
            />
            <button v-if="searchQuery" @click="searchQuery = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Filter type -->
          <select v-model="filterType"
            class="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/60 text-[0.78rem] outline-none focus:border-teal-500/50 transition cursor-pointer">
            <option value="all" class="bg-[#0c1a2e]">Semua Tipe</option>
            <option value="pdf" class="bg-[#0c1a2e]">PDF</option>
            <option value="text" class="bg-[#0c1a2e]">Text/DOCX</option>
          </select>

          <!-- Refresh -->
          <button @click="fetchDocuments" :disabled="loading" title="Refresh"
            class="w-8 h-8 flex items-center justify-center bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/40 hover:bg-white/[0.09] hover:text-white/70 transition disabled:opacity-40">
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="w-8 h-8 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin"></div>
      </div>

      <!-- Document list -->
      <div v-else-if="filteredDocuments.length > 0" class="divide-y divide-white/[0.05]">
        <div
          v-for="doc in filteredDocuments"
          :key="doc.id"
          class="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.025] transition group"
        >
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <!-- Icon -->
            <div :class="getDocTypeClass(doc.type)" class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-[0.82rem] font-medium text-white/80 truncate">{{ doc.name }}</h4>
              <div class="flex items-center gap-2 mt-0.5 text-[0.7rem] text-white/30">
                <span class="uppercase">{{ doc.type }}</span>
                <span class="text-white/15">•</span>
                <span>{{ doc.chunks }} chunks</span>
                <span class="text-white/15">•</span>
                <span>{{ formatDate(doc.uploaded_at) }}</span>
              </div>
            </div>

            <!-- Status badge -->
            <span :class="getStatusClass(doc.status)" class="px-2.5 py-0.5 text-[0.68rem] font-semibold rounded-full shrink-0">
              {{ doc.status }}
            </span>
          </div>

          <!-- Delete action -->
          <div class="ml-4 opacity-0 group-hover:opacity-100 transition">
            <button
              @click="deleteDocument(doc.id, doc.name)"
              :disabled="deleting === doc.id"
              title="Delete"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/[0.08] transition disabled:opacity-40"
            >
              <div v-if="deleting === doc.id" class="w-4 h-4 rounded-full border-2 border-red-400/20 border-t-red-400 animate-spin"></div>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center py-16 gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.05] text-white/20">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-[0.82rem] font-medium text-white/30">Tidak ada dokumen</p>
        <p class="text-[0.73rem] text-white/20">Belum ada dokumen yang diupload atau dokumen tidak ditemukan</p>
      </div>

      <!-- Footer / Pagination -->
      <div v-if="filteredDocuments.length > 0" class="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.06]">
        <p class="text-[0.75rem] text-white/30">
          Menampilkan {{ filteredDocuments.length }} dari {{ totalDocuments }} dokumen
        </p>
        <button
          v-if="filteredDocuments.length < totalDocuments"
          @click="loadMore"
          :disabled="loading"
          class="px-3.5 py-1.5 text-[0.75rem] font-medium text-white/45 bg-white/[0.05] border border-white/[0.08] rounded-lg hover:bg-white/[0.09] hover:text-white/70 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import adminApi from '@/services/adminApi';

const emit = defineEmits(['document-deleted', 'delete-error']);

const documents      = ref([]);
const searchQuery    = ref('');
const filterType     = ref('all');
const loading        = ref(false);
const deleting       = ref(null);
const totalDocuments = ref(0);
const currentPage    = ref(1);
const itemsPerPage   = 100;

const filteredDocuments = computed(() => {
  let filtered = documents.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(doc => doc.name.toLowerCase().includes(query));
  }
  if (filterType.value !== 'all') {
    filtered = filtered.filter(doc => doc.type === filterType.value);
  }
  return filtered;
});

const fetchDocuments = async () => {
  try {
    loading.value = true;
    const result = await adminApi.getDocuments(currentPage.value, itemsPerPage);
    if (result.success) {
      documents.value      = result.data.documents || [];
      totalDocuments.value = result.data.total || 0;
    } else {
      emit('delete-error', result.error || 'Failed to load documents');
    }
  } catch {
    emit('delete-error', 'Failed to load documents');
  } finally {
    loading.value = false;
  }
};

const deleteDocument = async (docId, docName) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus "${docName}"?`)) return;
  try {
    deleting.value = docId;
    const result = await adminApi.deleteDocument(docId);
    if (result.success) {
      documents.value = documents.value.filter(doc => doc.id !== docId);
      totalDocuments.value--;
      emit('document-deleted', docId);
    } else {
      emit('delete-error', result.error || 'Failed to delete document');
    }
  } catch {
    emit('delete-error', 'Failed to delete document');
  } finally {
    deleting.value = null;
  }
};  

const loadMore = async () => { currentPage.value++; await fetchDocuments(); };

const getDocTypeClass = (type) => ({
  pdf:  'bg-red-500/80',
  text: 'bg-blue-500/80',
  docx: 'bg-blue-500/80',
  doc:  'bg-blue-500/80',
}[type] || 'bg-white/10');

const getStatusClass = (status) => ({
  'Completed':  'bg-emerald-500/15 text-emerald-400',
  'Processing': 'bg-blue-500/15 text-blue-400',
  'Failed':     'bg-red-500/15 text-red-400',
  'Pending':    'bg-amber-500/15 text-amber-400',
}[status] || 'bg-white/10 text-white/40');

const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return 'N/A'; }
};

onMounted(() => fetchDocuments());
</script>