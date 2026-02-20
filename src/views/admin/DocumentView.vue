<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-[1.4rem] font-bold text-slate-100 tracking-tight mb-1">Document Management</h1>
      <p class="text-[0.8rem] text-white/35">Upload dan kelola dokumen untuk knowledge base</p>
    </div>

    <!-- Alerts -->
    <ErrorMessage
      v-if="uploadSuccess"
      type="success"
      title="Upload Berhasil"
      message="Dokumen berhasil diupload dan sedang diproses"
      closable
      @close="uploadSuccess = false"
      class="mb-5"
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
      class="mb-5"
    />
    <ErrorMessage
      v-if="deleteError"
      type="error"
      title="Delete Gagal"
      :message="deleteError"
      closable
      @close="deleteError = null"
      class="mb-5"
    />

    <!-- Upload Section -->
    <div class="mb-5">
      <DocumentUpload @upload-complete="handleUploadComplete" />
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 text-center">
        <p class="text-[0.7rem] font-medium text-white/35 uppercase tracking-widest mb-1.5">Total</p>
        <p class="text-[1.8rem] font-bold text-white leading-none tracking-tight">
          {{ statsLoading ? '-' : documentStats.total }}
        </p>
      </div>
      <div class="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 text-center">
        <p class="text-[0.7rem] font-medium text-white/35 uppercase tracking-widest mb-1.5">Selesai</p>
        <p class="text-[1.8rem] font-bold text-teal-400 leading-none tracking-tight">
          {{ statsLoading ? '-' : documentStats.completed }}
        </p>
      </div>
    </div>

    <!-- Document List Panel -->
    <div class="bg-white/[0.04] backdrop-blur-xl border border-white/[0.07] rounded-[14px] overflow-hidden min-h-[200px]">
      <DocumentList
        @document-deleted="handleDocumentDeleted"
        @delete-error="handleDeleteError"
      />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import DocumentUpload from '@/components/admin/DocumentUpload.vue';
import DocumentList from '@/components/admin/DocumentList.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import adminApi from '@/services/adminApi';

const uploadSuccess = ref(false);
const uploadError   = ref(null);
const deleteError   = ref(null);
const statsLoading  = ref(false);

const documentStats = ref({ total: 0, completed: 0 });

const fetchStats = async () => {
  try {
    statsLoading.value = true;
    const result = await adminApi.getStats();
    if (result.success) {
      documentStats.value = {
        total:     result.data.total     || 0,
        completed: result.data.completed || 0,
      };
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  } finally {
    statsLoading.value = false;
  }
};

const handleUploadComplete = () => {
  uploadSuccess.value = true;
  fetchStats();
  setTimeout(() => { uploadSuccess.value = false; }, 5000);
};

const handleDocumentDeleted = () => fetchStats();
const handleDeleteError = (err) => { deleteError.value = err; };
const retryUpload = () => { uploadError.value = null; };

onMounted(() => fetchStats());
</script>