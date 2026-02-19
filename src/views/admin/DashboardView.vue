<template>
  <AdminLayout>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Ringkasan dokumen yang telah diupload</p>
      </div>
      <button
        @click="refreshData"
        :disabled="isLoading"
        class="btn-refresh"
      >
        <svg class="w-4 h-4" :class="{ 'spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <div class="content-stack">
      <!-- Stat Cards -->
      <div class="stats-grid">
        <!-- Total -->
        <div class="stat-card stat-total">
          <div class="stat-top">
            <span class="stat-label">Total Dokumen</span>
            <div class="stat-icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <p class="stat-number">{{ stats.totalDocuments }}</p>
          <p class="stat-sub">dokumen tersimpan</p>
        </div>

        <!-- Completed -->
        <div class="stat-card stat-success">
          <div class="stat-top">
            <span class="stat-label">Selesai</span>
            <div class="stat-icon icon-green">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p class="stat-number text-white">{{ stats.completed }}</p>
          <p class="stat-sub text-green-300">selesai diproses</p>
        </div>

        <!-- Failed -->
        <div class="stat-card stat-danger">
          <div class="stat-top">
            <span class="stat-label">Gagal</span>
            <div class="stat-icon icon-red">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p class="stat-number text-white">{{ stats.failed }}</p>
          <p class="stat-sub text-red-300">gagal diproses</p>
        </div>
      </div>

      <!-- Document List -->
      <div class="doc-panel">
        <div class="doc-panel-header">
          <h2 class="doc-panel-title">Daftar Dokumen</h2>
          <div class="tab-group">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="['tab-btn', activeTab === tab.value ? 'tab-active' : 'tab-inactive']"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="isLoadingDocs" class="divide-y divide-white/5">
          <div v-for="i in 5" :key="i" class="doc-row skeleton-row">
            <div class="skeleton-icon"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton-line w-2/5"></div>
              <div class="skeleton-line w-1/4 h-2.5"></div>
            </div>
            <div class="skeleton-badge"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredDocuments.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="empty-text">Belum ada dokumen</p>
        </div>

        <!-- Document rows -->
        <div v-else class="divide-y divide-white/5">
          <div
            v-for="doc in filteredDocuments"
            :key="doc.id"
            class="doc-row"
          >
            <div class="doc-icon" :class="fileIconBg(doc.file_type)">
              <svg width="16" height="16" :class="fileIconColor(doc.file_type)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <p class="doc-name">{{ doc.filename || doc.name || 'Untitled' }}</p>
              <p class="doc-date">{{ formatDate(doc.created_at || doc.uploaded_at) }}</p>
            </div>

            <span :class="['status-badge', statusBadge(doc.status)]">
              <span class="status-dot" :class="statusDot(doc.status)"></span>
              {{ statusLabel(doc.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import adminApi from '@/services/adminApi';
import AdminLayout from '@/components/layout/AdminLayout.vue';

const isLoading     = ref(false);
const isLoadingDocs = ref(false);
const activeTab     = ref('all');

const tabs = [
  { label: 'Semua',    value: 'all' },
  { label: 'Selesai',  value: 'completed' },
  { label: 'Diproses', value: 'processing' },
  { label: 'Gagal',    value: 'failed' },
];

const stats = ref({ totalDocuments: 0, completed: 0, failed: 0 });
const documents = ref([]);

const filteredDocuments = computed(() => {
  if (activeTab.value === 'all') return documents.value;
  return documents.value.filter(doc => doc.status === activeTab.value);
});

onMounted(() => refreshData());

const fetchStats = async () => {
  isLoading.value = true;
  try {
    const result = await adminApi.getStats();
    if (result.success) {
      const d = result.data;
      stats.value = {
        totalDocuments: d.total     || 0,
        completed:      d.completed || 0,
        failed:         d.failed    || 0,
      };
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  } finally {
    isLoading.value = false;
  }
};

const fetchDocuments = async () => {
  isLoadingDocs.value = true;
  try {
    const result = await adminApi.getDocuments(1, 100);
    if (result.success) {
      documents.value = result.data.documents || result.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch documents:', err);
  } finally {
    isLoadingDocs.value = false;
  }
};

const refreshData = () => { fetchStats(); fetchDocuments(); };

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const statusLabel = (s) => ({ completed: 'Selesai', processing: 'Diproses', failed: 'Gagal', pending: 'Menunggu' }[s] || s);
const statusBadge = (s) => ({ completed: 'badge-green', processing: 'badge-blue', failed: 'badge-red', pending: 'badge-yellow' }[s] || 'badge-gray');
const statusDot   = (s) => ({ completed: 'bg-green-400', processing: 'bg-blue-400', failed: 'bg-red-400', pending: 'bg-yellow-400' }[s] || 'bg-gray-400');
const fileIconBg  = (t) => ({ pdf: 'icon-bg-red', docx: 'icon-bg-blue', txt: 'icon-bg-gray' }[t?.toLowerCase()] || 'icon-bg-teal');
const fileIconColor = (t) => ({ pdf: 'text-red-400', docx: 'text-blue-400', txt: 'text-gray-400' }[t?.toLowerCase()] || 'text-teal-400');
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
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

.content-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Refresh button ──────────────────────────────────── */
.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-refresh:hover:not(:disabled) {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.85);
}
.btn-refresh:disabled { opacity: 0.45; cursor: not-allowed; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Stat cards ──────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 1.25rem 1.4rem;
}

.stat-total {
  background: linear-gradient(135deg, rgba(37,99,235,0.5), rgba(13,148,136,0.4));
  border-color: rgba(37,99,235,0.3);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.9rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-icon {
  width: 34px;
  height: 34px;
  background: rgba(255,255,255,0.1);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.7);
}

.icon-green { background: rgba(16,185,129,0.15); color: #34d399; }
.icon-red   { background: rgba(239,68,68,0.15);  color: #f87171; }

.stat-number {
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  margin: 0 0 0.3rem;
  letter-spacing: -0.03em;
}

.stat-sub {
  font-size: 0.73rem;
  color: rgba(255,255,255,0.4);
  margin: 0;
}

/* ── Document panel ──────────────────────────────────── */
.doc-panel {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
}

.doc-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.4rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.doc-panel-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

/* ── Tabs ────────────────────────────────────────────── */
.tab-group {
  display: flex;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.tab-btn {
  padding: 0.3rem 0.75rem;
  font-size: 0.73rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.tab-active {
  background: rgba(13,148,136,0.3);
  color: #5eead4;
}

.tab-inactive {
  background: transparent;
  color: rgba(255,255,255,0.35);
}
.tab-inactive:hover { color: rgba(255,255,255,0.65); }

/* ── Doc rows ────────────────────────────────────────── */
.doc-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.4rem;
  transition: background 0.15s;
}
.doc-row:hover { background: rgba(255,255,255,0.03); }

.doc-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-bg-red  { background: rgba(239,68,68,0.12); }
.icon-bg-blue { background: rgba(59,130,246,0.12); }
.icon-bg-gray { background: rgba(148,163,184,0.1); }
.icon-bg-teal { background: rgba(13,148,136,0.12); }

.doc-name {
  font-size: 0.825rem;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 0.2rem;
}
.doc-date {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.3);
  margin: 0;
}

/* ── Status badge ────────────────────────────────────── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
  flex-shrink: 0;
}
.badge-green  { background: rgba(16,185,129,0.12); color: #34d399; }
.badge-blue   { background: rgba(59,130,246,0.12);  color: #60a5fa; }
.badge-red    { background: rgba(239,68,68,0.12);   color: #f87171; }
.badge-yellow { background: rgba(234,179,8,0.12);   color: #facc15; }
.badge-gray   { background: rgba(148,163,184,0.1);  color: #94a3b8; }

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

/* ── Empty state ─────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
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
  margin-bottom: 0.75rem;
}
.empty-text {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.25);
}

/* ── Skeleton ────────────────────────────────────────── */
.skeleton-row { pointer-events: none; }
.skeleton-icon {
  width: 36px; height: 36px;
  background: rgba(255,255,255,0.06);
  border-radius: 9px;
  flex-shrink: 0;
}
.skeleton-line {
  height: 10px;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
}
.skeleton-badge {
  width: 60px; height: 22px;
  background: rgba(255,255,255,0.06);
  border-radius: 999px;
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>