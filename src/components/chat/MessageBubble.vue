<template>
  <div :class="bubbleAlignment" class="flex items-end space-x-2 mb-4">
    <!-- Avatar for assistant -->
    <div v-if="type === 'assistant'" class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>

    <!-- Message Content -->
    <div :class="bubbleClass" class="max-w-md lg:max-w-lg xl:max-w-xl">
      <div v-if="type === 'system'" class="flex items-center space-x-2 mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-xs font-medium">System Message</span>
      </div>

      <div class="prose prose-sm max-w-none">
        <slot />
      </div>

      <!-- Metadata -->
      <div v-if="showMetadata" :class="metadataClass" class="flex items-center space-x-2 mt-2 text-xs">
        <span>{{ formattedTime }}</span>
        <span v-if="type === 'user' && status" class="flex items-center space-x-1">
          <svg v-if="status === 'sending'" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else-if="status === 'sent'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="status === 'read'" class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Avatar for user -->
    <div v-if="type === 'user'" class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'user',
    validator: (value) => ['user', 'assistant', 'system'].includes(value)
  },
  timestamp: {
    type: [Date, String, Number],
    default: () => new Date()
  },
  status: {
    type: String,
    default: '',
    validator: (value) => ['', 'sending', 'sent', 'read', 'error'].includes(value)
  },
  showMetadata: {
    type: Boolean,
    default: true
  }
});

const bubbleAlignment = computed(() => {
  return props.type === 'user' ? 'flex-row-reverse' : 'flex-row';
});

const bubbleClass = computed(() => {
  const baseClass = 'rounded-2xl px-4 py-3 break-words';
  
  const typeClasses = {
    user: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto',
    assistant: 'bg-gray-100 text-gray-900',
    system: 'bg-yellow-50 text-yellow-900 border border-yellow-200 mx-auto'
  };
  
  return `${baseClass} ${typeClasses[props.type]}`;
});

const metadataClass = computed(() => {
  return props.type === 'user' ? 'text-blue-200' : 'text-gray-500';
});

const formattedTime = computed(() => {
  const date = new Date(props.timestamp);
  return date.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});
</script>

<style scoped>
.prose {
  @apply text-sm leading-relaxed;
}

.prose p {
  @apply mb-2 last:mb-0;
}

.prose a {
  @apply underline hover:no-underline;
}

.prose code {
  @apply bg-black bg-opacity-10 px-1.5 py-0.5 rounded text-xs font-mono;
}

.prose pre {
  @apply bg-black bg-opacity-10 p-3 rounded-lg overflow-x-auto;
}

.prose pre code {
  @apply bg-transparent p-0;
}
</style>