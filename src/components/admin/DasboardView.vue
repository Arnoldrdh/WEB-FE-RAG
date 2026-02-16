<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Ringkasan dokumen yang telah diupload</p>
      </div>
      <button
        @click="refreshData"
        :disabled="isLoading"
        class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
      >
        <svg
          class="w-4 h-4"
          :class="{ 'animate-spin': isLoading }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Refresh</span>
      </button>
    </div>

    <div class="space-y-6">
      <!-- Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total -->
        <div
          class="col-span-2 lg:col-span-1 bg-blue-600 rounded-xl p-5 text-white shadow-md"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-blue-100">Total Dokumen</span>
            <div class="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <p class="text-4xl font-bold">{{ stats.totalDocuments }}</p>
          <p class="text-xs text-blue-200 mt-1">dokumen tersimpan</p>
        </div>

        <!-- Completed -->
        <div class="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500">Selesai</span>
            <div class="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.completed }}</p>
          <p class="text-xs text-green-600 font-medium mt-1">selesai diproses</p>
        </div>

        <!-- Processing -->
        <div class="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500">Diproses</span>
            <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-blue-500 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.processing }}</p>
          <p class="text-xs text-blue-500 font-medium mt-1">sedang berjalan</p>
        </div>

        <!-- Failed -->
        <div class="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500">Gagal</span>
            <div class="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.failed }}</p>
          <p class="text-xs text-red-500 font-medium mt-1">gagal diproses</p>
        </div>
      </div>

      <!-- Document List -->
      <div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-700">Daftar Dokumen</h2>
          <!-- Filter tabs -->
          <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="
                activeTab === tab.value
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              "
              class="px-3 py-1 text-xs font-medium rounded-md transition-all"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="isLoadingDocs" class="divide-y divide-gray-50">
          <div
            v-for="i in 5"
            :key="i"
            class="px-6 py-4 flex items-center gap-4 animate-pulse"
          >
            <div class="w-9 h-9 bg-gray-100 rounded-lg flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 bg-gray-100 rounded w-2/5"></div>
              <div class="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
            <div class="w-16 h-6 bg-gray-100 rounded-full"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredDocuments.length === 0" class="py-16 text-center">
          <div
            class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3"
          >
            <svg
              class="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p class="text-sm text-gray-400">Belum ada dokumen</p>
        </div>

        <!-- Document rows -->
        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="doc in filteredDocuments"
            :key="doc.id"
            class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <!-- File icon -->
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="fileIconBg(doc.file_type)"
            >
              <svg
                class="w-4 h-4"
                :class="fileIconColor(doc.file_type)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <!-- Name & date -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ doc.filename || doc.name || "Untitled" }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ formatDate(doc.created_at || doc.uploaded_at) }}
              </p>
            </div>

            <!-- Status badge -->
            <span
              :class="statusBadge(doc.status)"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="statusDot(doc.status)"
              ></span>
              {{ statusLabel(doc.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Upload Section -->
      <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h2 class="text-sm font-semibold text-gray-700 mb-4">Upload Dokumen</h2>
        <DocumentUpload
          @upload-complete="handleUploadComplete"
          @upload-error="handleUploadError"
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import adminApi from "@/services/adminApi";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import DocumentUpload from "@/components/admin/DocumentUpload.vue";

const isLoading = ref(false);
const isLoadingDocs = ref(false);
const activeTab = ref("all");

const tabs = [
  { label: "Semua", value: "all" },
  { label: "Selesai", value: "completed" },
  { label: "Diproses", value: "processing" },
  { label: "Gagal", value: "failed" },
];

const stats = ref({
  totalDocuments: 0,
  processing: 0,
  completed: 0,
  failed: 0,
});

const documents = ref([]);

const filteredDocuments = computed(() => {
  if (activeTab.value === "all") return documents.value;
  return documents.value.filter((doc) => doc.status === activeTab.value);
});

// ── fetch ─────────────────────────────────────────────────────
onMounted(() => refreshData());

const fetchStats = async () => {
  isLoading.value = true;
  try {
    const result = await adminApi.getStats();
    if (result.success) {
      const d = result.data;
      stats.value = {
        totalDocuments: d.total || 0,
        processing: d.processing || 0,
        completed: d.completed || 0,
        failed: d.failed || 0,
      };
    }
  } catch (err) {
    console.error("Failed to fetch stats:", err);
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
    console.error("Failed to fetch documents:", err);
  } finally {
    isLoadingDocs.value = false;
  }
};

const refreshData = () => {
  fetchStats();
  fetchDocuments();
};

// ── upload handlers ───────────────────────────────────────────
const handleUploadComplete = () => refreshData();
const handleUploadError = (e) => console.error("Upload error:", e);

// ── helpers ───────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusLabel = (status) =>
  ({
    completed: "Selesai",
    processing: "Diproses",
    failed: "Gagal",
    pending: "Menunggu",
  }[status] || status);

const statusBadge = (status) =>
  ({
    completed: "bg-green-50 text-green-700",
    processing: "bg-blue-50 text-blue-700",
    failed: "bg-red-50 text-red-600",
    pending: "bg-yellow-50 text-yellow-700",
  }[status] || "bg-gray-100 text-gray-600");

const statusDot = (status) =>
  ({
    completed: "bg-green-500",
    processing: "bg-blue-500",
    failed: "bg-red-500",
    pending: "bg-yellow-500",
  }[status] || "bg-gray-400");

const fileIconBg = (type) =>
  ({
    pdf: "bg-red-50",
    docx: "bg-blue-50",
    txt: "bg-gray-100",
  }[type?.toLowerCase()] || "bg-purple-50");

const fileIconColor = (type) =>
  ({
    pdf: "text-red-500",
    docx: "text-blue-500",
    txt: "text-gray-500",
  }[type?.toLowerCase()] || "text-purple-500");
</script>
