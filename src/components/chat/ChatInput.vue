<template>
  <div class="relative">
    <div class="flex items-end space-x-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
      <!-- Textarea -->
      <textarea
        ref="textareaRef"
        v-model="localValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @keydown.enter.exact.prevent="handleSend"
        @input="adjustHeight"
        rows="1"
        class="flex-1 bg-transparent border-0 focus:ring-0 resize-none px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed max-h-32 overflow-y-auto"
      ></textarea>

      <!-- Send Button -->
      <button
        @click="handleSend"
        :disabled="!localValue.trim() || disabled"
        class="m-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all flex-shrink-0"
      >
        <svg v-if="!disabled" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </button>
    </div>

    <!-- Character count (optional) -->
    <div v-if="showCharCount && localValue.length > 0" class="absolute -bottom-6 right-0 text-xs text-gray-400">
      {{ localValue.length }} karakter
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Ketik pesan Anda...'
  },
  showCharCount: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'send']);

const localValue = ref(props.modelValue);
const textareaRef = ref(null);

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

watch(localValue, (newValue) => {
  emit('update:modelValue', newValue);
});

const adjustHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
  }
};

const handleSend = () => {
  if (localValue.value.trim() && !props.disabled) {
    emit('send');
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
      }
    });
  }
};
</script>