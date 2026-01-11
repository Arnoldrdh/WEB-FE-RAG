<template>
  <div class="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-200">
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
      
      <!-- Example Questions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        <button 
          v-for="example in exampleQuestions" 
          :key="example"
          @click="handleExampleClick(example)"
          class="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition group"
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
    <div v-else ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6">
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id"
        :message="message"
      />
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-start space-x-3">
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
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 p-4">
      <ChatInput 
        v-model="inputMessage"
        :disabled="isLoading"
        @send="handleSend"
        :placeholder="messages.length === 0 ? 'Ketik pertanyaan Anda...' : 'Lanjutkan percakapan...'"
      />
      <p class="text-xs text-gray-400 text-center mt-2">
        KnowledgeDesk dapat membuat kesalahan. Harap periksa informasi penting.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';

const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref(null);

const exampleQuestions = [
  'Apa itu machine learning dan bagaimana cara kerjanya?',
  'Bagaimana cara mengoptimalkan performa aplikasi web?',
  'Jelaskan tentang arsitektur microservices',
  'Apa perbedaan antara SQL dan NoSQL?'
];

const handleExampleClick = (question) => {
  inputMessage.value = question;
  handleSend();
};

const handleSend = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  };

  messages.value.push(userMessage);
  inputMessage.value = '';
  isLoading.value = true;

  // Scroll to bottom
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }

  // TODO: Implement API call with axios
  // Dummy response for now
  setTimeout(() => {
    const botMessage = {
      id: Date.now(),
      type: 'assistant',
      content: 'Ini adalah contoh respon dari sistem. Integrasi dengan API akan ditambahkan menggunakan axios.',
      sources: [
        {
          id: 1,
          title: 'Document Example.pdf',
          page: 5,
          confidence: 0.95
        },
        {
          id: 2,
          title: 'Reference Guide.docx',
          page: 12,
          confidence: 0.88
        }
      ],
      timestamp: new Date()
    };
    messages.value.push(botMessage);
    isLoading.value = false;
    
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  }, 1500);
};
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
</style>