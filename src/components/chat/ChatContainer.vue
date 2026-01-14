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
      <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Selamat datang di KnowledgeDesk</h2>
      <p class="text-gray-500 text-center max-w-md mb-8">
        Tanyakan apapun dan dapatkan jawaban yang akurat dengan referensi dokumen lengkap
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
      
      <!-- Example Questions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        <button 
          v-for="example in exampleQuestions" 
          :key="example"
          @click="handleExampleClick(example)"
          :disabled="!isConnected"
          class="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-gray-700 group-hover:text-gray-900">{{ example }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div v-else ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id"
        :message="message"
      />
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-start space-x-3 animate-fade-in">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div class="flex-1 bg-gray-50 rounded-2xl p-4">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Mencari jawaban...</p>
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
        <div v-if="sessionId" class="flex items-center space-x-1 text-xs text-gray-400">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Session active</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import ragApi from '@/services/ragApi';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';

const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const error = ref(null);
const messagesContainer = ref(null);
const sessionId = ref(null);
const isConnected = ref(true);

const exampleQuestions = [
  'Apa itu machine learning dan bagaimana cara kerjanya?',
  'Bagaimana cara mengoptimalkan performa aplikasi web?',
  'Jelaskan tentang arsitektur microservices',
  'Apa perbedaan antara SQL dan NoSQL?'
];

// Initialize session on component mount
onMounted(async () => {
  await initializeSession();
});

// Cleanup on unmount
onBeforeUnmount(() => {
  // Optional: Delete session when user leaves
  // if (sessionId.value) {
  //   ragApi.deleteSession(sessionId.value);
  // }
});

/**
 * Initialize chat session
 */
const initializeSession = async () => {
  try {
    const result = await ragApi.createSession();
    
    if (result.success) {
      sessionId.value = result.data.session_id || generateSessionId();
      isConnected.value = true;
      console.log(' Session created:', sessionId.value);
    } else {
      console.warn(' Failed to create session, using local ID');
      sessionId.value = generateSessionId();
      isConnected.value = false;
    }
  } catch (err) {
    console.error(' Session initialization error:', err);
    sessionId.value = generateSessionId();
    isConnected.value = false;
  }
};

/**
 * Generate local session ID as fallback
 */
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Handle example question click
 */
const handleExampleClick = (question) => {
  if (!isConnected.value) {
    error.value = 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
    return;
  }
  inputMessage.value = question;
  handleSend();
};

/**
 * Handle send message
 */
const handleSend = async () => {
  // Validation
  if (!inputMessage.value.trim() || isLoading.value) return;
  
  // Check connection
  if (!isConnected.value) {
    error.value = 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
    return;
  }

  // Clear previous error
  error.value = null;

  // Create user message
  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date()
  };

  // Add user message to chat
  messages.value.push(userMessage);
  
  // Save query and clear input
  const query = inputMessage.value.trim();
  inputMessage.value = '';
  isLoading.value = true;

  // Scroll to bottom
  await nextTick();
  scrollToBottom();

  try {
    // Call RAG API
    console.log(' Sending query to API:', query);
    const result = await ragApi.ask(
      query,
      5, // k - number of documents to retrieve
      sessionId.value
    );

    console.log('📥 API Response:', result);

    if (result.success) {
      // Success - Add bot message
      const botMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: result.data.answer || 'Maaf, saya tidak dapat menemukan jawaban.',
        sources: formatSources(result.data.sources),
        timestamp: new Date()
      };
      
      messages.value.push(botMessage);
      isConnected.value = true;
      
    } else {
      // API returned error
      console.error(' API Error:', result.error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Maaf, terjadi kesalahan: ${result.error}`,
        timestamp: new Date()
      };
      
      messages.value.push(errorMessage);
      error.value = result.error;
      
      // Check if it's a connection error
      if (result.error.includes('Network') || result.error.includes('timeout')) {
        isConnected.value = false;
      }
    }
    
  } catch (err) {
    // Unexpected error
    console.error('Unexpected error:', err);
    
    const errorMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
      timestamp: new Date()
    };
    
    messages.value.push(errorMessage);
    error.value = 'Terjadi kesalahan yang tidak terduga';
    isConnected.value = false;
    
  } finally {
    isLoading.value = false;
    
    // Scroll to bottom
    await nextTick();
    scrollToBottom();
  }
};

/**
 * Format sources from API response
 */
const formatSources = (sources) => {
  if (!sources || !Array.isArray(sources)) return [];
  
  return sources.map((source, index) => ({
    id: source.id || index,
    title: source.metadata?.filename || source.metadata?.source || 'Unknown Document',
    page: source.metadata?.page || 1,
    confidence: source.score || 0,
    relevance: source.score || 0,
    document_id: source.document_id || source.id,
    content: source.content // Keep content for reference
  }));
};

/**
 * Scroll messages to bottom
 */
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

/**
 * Clear chat history
 */
const clearChat = () => {
  if (confirm('Apakah Anda yakin ingin menghapus riwayat chat?')) {
    messages.value = [];
    error.value = null;
  }
};

// Expose methods for parent component (optional)
defineExpose({
  clearChat,
  messages
});
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
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

/* Smooth scrolling */
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