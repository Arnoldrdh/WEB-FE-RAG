<template>
  <div class="flex items-start space-x-3" :class="message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''">
    <!-- Avatar -->
    <div v-if="message.type === 'assistant'" class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
    <div v-else class="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>

    <!-- Message Content -->
    <div class="flex-1 max-w-3xl">
      <div 
        class="rounded-2xl p-4"
        :class="message.type === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto' 
          : 'bg-gray-50 text-gray-900'"
      >
        <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
      </div>

      <!-- Sources/References - Only for assistant messages -->
      <div v-if="message.type === 'assistant' && message.sources && message.sources.length > 0" class="mt-3">
        <div class="flex items-center space-x-2 mb-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span class="text-xs font-medium text-gray-600">Sumber Referensi ({{ message.sources.length }})</span>
        </div>
        
        <div class="space-y-2">
          <SourceReference 
            v-for="source in message.sources" 
            :key="source.id"
            :source="source"
          />
        </div>
      </div>

      <!-- Timestamp -->
      <p class="text-xs text-gray-400 mt-2" :class="message.type === 'user' ? 'text-right' : ''">
        {{ formatTime(message.timestamp) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import SourceReference from './SourceReference.vue';

defineProps({
  message: {
    type: Object,
    required: true
  }
});

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
</script>