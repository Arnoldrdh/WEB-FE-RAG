<template>
  <AdminLayout>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Document Management</h1>
        <p class="page-subtitle">Upload dan kelola dokumen untuk knowledge base</p>
      </div>
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
    <div class="upload-section">
      <DocumentUpload @upload-complete="handleUploadComplete" />
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-item">
        <p class="stat-label">Total</p>
        <p class="stat-value">{{ statsLoading ? '-' : documentStats.total }}</p>
      </div>
      <div class="stat-item">
        <p class="stat-label">Diproses</p>
        <p class="stat-value text-blue-400">{{ statsLoading ? '-' : documentStats.processing }}</p>
      </div>
      <div class="stat-item">
        <p class="stat-label">Selesai</p>
        <p class="stat-value text-teal-400">{{ statsLoading ? '-' : documentStats.completed }}</p>
      </div>
      <div class="stat-item">
        <p class="stat-label">Gagal</p>
        <p class="stat-value text-red-400">{{ statsLoading ? '-' : documentStats.failed }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="['tab-btn', activeTab === tab.value ? 'tab-active' : 'tab-inactive']"
      >
        {{ tab.label }}
        <span v-if="tab.count !== undefined" :class="['tab-count', activeTab === tab.value ? 'count-active' : 'count-inactive']">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Content -->
    <div class="panel">
      <DocumentList
        v-if="activeTab === 'all'"
        @document-deleted="handleDocumentDeleted"
        @delete-error="handleDeleteError"
      />

      <div v-else-if="activeTab === 'processing'" class="panel-empty">
        <div class="empty-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="empty-title">Tidak ada dokumen yang sedang diproses</p>
      </div>

      <div v-else-if="activeTab === 'failed'" class="panel-empty">
        <div class="empty-icon icon-green">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="empty-title">Semua dokumen berhasil diproses</p>
      </div>
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

const activeTab    = ref('all');
const uploadSuccess = ref(false);
const uploadError  = ref(null);
const deleteError  = ref(null);
const statsLoading = ref(false);

const documentStats = ref({ total: 0, processing: 0, completed: 0, failed: 0 });

const tabs = computed(() => [
  { label: 'Semua Dokumen', value: 'all',        count: documentStats.value.total },
  { label: 'Diproses',      value: 'processing', count: documentStats.value.processing },
  { label: 'Gagal',         value: 'failed',      count: documentStats.value.failed },
]);

const fetchStats = async () => {
  try {
    statsLoading.value = true;
    const result = await adminApi.getStats();
    if (result.success) {
      documentStats.value = {
        total:      result.data.total      || 0,
        processing: result.data.processing || 0,
        completed:  result.data.completed  || 0,
        failed:     result.data.failed     || 0,
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

<style scoped>
/* ── Layout ──────────────────────────────────────────── */
.page-header {
  margin-bottom: 1.5rem;
}
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.2rem;
  letter-spacing: -0.02em;
}
.page-subtitle {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.35);
  margin: 0;
}

/* ── Upload section ──────────────────────────────────── */
.upload-section {
  margin-bottom: 1.25rem;
}

/* ── Stats bar ───────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 1rem 1.2rem;
  text-align: center;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 0.4rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1;
  letter-spacing: -0.03em;
}

/* ── Tabs ────────────────────────────────────────────── */
.tab-bar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  margin-bottom: 1.25rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.1rem;
  font-size: 0.8rem;
  font-weight: 500;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}

.tab-active {
  color: #5eead4;
  border-bottom-color: #0d9488;
}
.tab-inactive {
  color: rgba(255,255,255,0.35);
}
.tab-inactive:hover { color: rgba(255,255,255,0.65); }

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 600;
}
.count-active   { background: rgba(13,148,136,0.2); color: #5eead4; }
.count-inactive { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.35); }

/* ── Panel ───────────────────────────────────────────── */
.panel {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  overflow: hidden;
  min-height: 200px;
}

/* ── Empty state ─────────────────────────────────────── */
.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  gap: 0.75rem;
}

.empty-icon {
  width: 44px;
  height: 44px;
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.2);
}

.icon-green {
  background: rgba(16,185,129,0.1);
  color: #34d399;
}

.empty-title {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.3);
  margin: 0;
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .tab-bar { overflow-x: auto; }
}
</style>