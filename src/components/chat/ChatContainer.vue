<template>
  <div class="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-200">
    <!-- Error Alert -->
    <div v-if="error" class="mx-4 mt-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800">Error</p>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
        <button @click="error = null" class="text-red-400 hover:text-red-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="messages.length === 0" class="flex-1 flex flex-col items-center justify-center p-8">
      <!-- Icon -->
      <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Selamat datang di KnowledgeDesk</h2>
      <p class="text-gray-500 text-center max-w-md mb-8">
        Tanyakan apapun tentang Prodi Teknik Informatika dan dapatkan jawaban yang akurat dengan referensi dokumen lengkap
      </p>

      <!-- Connection Status -->
      <div v-if="!isConnected" class="mb-6">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="text-sm text-yellow-800">Tidak dapat terhubung ke server. Periksa koneksi Anda.</span>
        </div>
      </div>

      <!-- Prompt hint (no hardcoded questions) -->
      <div class="flex items-center space-x-2 text-sm text-gray-400">
        <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Mulai dengan mengetik pertanyaanmu di bawah</span>
      </div>
    </div>

    <!-- Messages Container -->
    <div v-else ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />

      <!-- Loading/Streaming State -->
      <div v-if="isLoading" class="flex items-start space-x-3 animate-fade-in">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div class="flex-1 bg-gray-50 rounded-2xl p-4">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
          <p class="text-xs text-gray-500">{{ loadingStatus || 'Mencari jawaban...' }}</p>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 p-4">
      <ChatInput
        v-model="inputMessage"
        :disabled="isLoading || !isConnected"
        @send="handleSend"
        :placeholder="messages.length === 0 ? 'Ketik pertanyaan Anda...' : 'Lanjutkan percakapan...'"
      />
      <div class="flex items-center justify-between mt-2">
        <p class="text-xs text-gray-400">
          KnowledgeDesk dapat membuat kesalahan. Harap periksa informasi penting.
        </p>
        <button
          v-if="messages.length > 0"
          @click="clearChat"
          class="text-xs text-gray-400 hover:text-red-500 transition"
        >
          Clear Chat
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import ragApi from '@/services/ragApi';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';

// ============================================
// State Management
// ============================================
const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const loadingStatus = ref('');
const error = ref(null);
const messagesContainer = ref(null);
const isConnected = ref(true);

// ============================================
// Example Questions
// ============================================
const exampleQuestions = [
  'Apa visi dari Prodi Teknik Informatika?',
  'Berapa SKS total untuk lulus dari prodi ini?',
  'Apa saja konsentrasi yang tersedia?',
  'Bagaimana prospek karir lulusan Teknik Informatika?'
];




// ============================================
// Handle Example Click
// ============================================
const handleExampleClick = (question) => {
  if (!isConnected.value) {
    error.value = 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
    return;
  }
  inputMessage.value = question;
  handleSend();
};

// ============================================
// MAIN: Handle Send Message with STREAMING
// ============================================
const handleSend = async () => {
  // Validation
  if (!inputMessage.value.trim() || isLoading.value) return;
  
 

  // Clear previous error
  error.value = null;

  // 1. Create user message
  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date()
  };

  messages.value.push(userMessage);
  
  // Save query and clear input
  const query = inputMessage.value.trim();
  inputMessage.value = '';
  isLoading.value = true;
  loadingStatus.value = 'Memproses pertanyaan...';

  // Scroll to bottom
  await nextTick();
  scrollToBottom();

  // 2. Create placeholder bot message for streaming
  const botMessageId = Date.now() + 1;
  const botMessage = {
    id: botMessageId,
    type: 'assistant',
    content: '',  //  Will be filled real-time
    sources: [],  //  Will be added when received
    timestamp: new Date(),
    isStreaming: true
  };
  
  messages.value.push(botMessage);
  
  try {
    // console.log(' Sending streaming query:', query);
    
    //  CALL STREAMING API
    await ragApi.askStreaming(
      query,
      5,  // k = 5 documents
      {
        // ============================================
        // Event Handler: Status Updates
        // ============================================
        onStatus: (message, progress) => {
          loadingStatus.value = message;
          // console.log(` [${progress}%] ${message}`);
        },

        // ============================================
        // Event Handler: Answer Chunks (REAL-TIME!)
        // ============================================
        onAnswer: (chunk, fullAnswer) => {
          // Find bot message and update content
          const msg = messages.value.find(m => m.id === botMessageId);
          if (msg) {
            msg.content = fullAnswer;  //  Update with full answer so far
          }
          
          // Auto-scroll as answer grows
          scrollToBottom();
        },

        // ============================================
        // Event Handler: Sources/Citations
        // ============================================
        onSources: (sources) => {
          const msg = messages.value.find(m => m.id === botMessageId);
          if (msg) {
            msg.sources = formatSources(sources);  //  Format and attach sources
          }
          // console.log(' Sources received:', sources.length);
        },

        // ============================================
        // Event Handler: Stream Complete
        // ============================================
        onDone: (metadata) => {
          const msg = messages.value.find(m => m.id === botMessageId);
          if (msg) {
            msg.isStreaming = false;  //  Mark as complete
          }
          
          isLoading.value = false;
          loadingStatus.value = '';
          isConnected.value = true;
          
          // console.log(' Stream completed');
          // console.log('   Metadata:', metadata);
        },

        // ============================================
        // Event Handler: Errors
        // ============================================
        onError: (errorMessage) => {
          error.value = errorMessage;
          
          const msg = messages.value.find(m => m.id === botMessageId);
          if (msg) {
            msg.content = `Maaf, terjadi kesalahan: ${errorMessage}`;
            msg.isStreaming = false;
          }
          
          isLoading.value = false;
          loadingStatus.value = '';
          
          // Check if connection error
          if (errorMessage.includes('Network') || errorMessage.includes('timeout') || errorMessage.includes('Failed to fetch')) {
            isConnected.value = false;
          }
        }
      }
    );
    
  } catch (err) {
    console.error(' Unexpected error:', err);
    // console.error(' Stack:', err?.stack);
    // console.error(' Message:', err?.message);
    
    const msg = messages.value.find(m => m.id === botMessageId);
    if (msg) {
      msg.content = 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
      msg.isStreaming = false;
    }
    
    error.value = 'Terjadi kesalahan yang tidak terduga';
    isConnected.value = false;
    
  } finally {
    isLoading.value = false;
    loadingStatus.value = '';
    
    await nextTick();
    scrollToBottom();
  }
};

// ============================================
// Format Sources from Backend
// ============================================
const formatSources = (sources) => {
  if (!sources || !Array.isArray(sources)) return [];
  
  return sources.map((source, index) => ({
    id: source.doc_id || index,
    title: source.filename || 'Unknown Document',
    page: source.page || 1,
    confidence: source.score || 0,
    relevance: source.score || 0,
    snippet: source.snippet || '',
    document_id: source.doc_id
  }));
};

// ============================================
// Scroll to Bottom
// ============================================
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

// ============================================
// Clear Chat
// ============================================
const clearChat = () => {
  if (confirm('Apakah Anda yakin ingin menghapus riwayat chat?')) {
    messages.value = [];
    error.value = null;
  }
};

// Expose methods
defineExpose({
  clearChat,
  messages
});
</script>

<style scoped>
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>