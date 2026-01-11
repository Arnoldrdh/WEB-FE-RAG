<template>
  <div :class="alertClasses" class="rounded-lg p-4" role="alert">
    <div class="flex items-start">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <svg :class="iconClass" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
        </svg>
      </div>

      <!-- Content -->
      <div class="ml-3 flex-1">
        <h3 v-if="title" :class="titleClass" class="text-sm font-medium">
          {{ title }}
        </h3>
        <div :class="messageClass" class="text-sm">
          <slot>
            {{ message }}
          </slot>
        </div>

        <!-- Action Buttons -->
        <div v-if="$slots.actions || showRetry || showDismiss" class="mt-3 flex space-x-3">
          <slot name="actions">
            <BaseButton
              v-if="showRetry"
              variant="ghost"
              size="sm"
              @click="$emit('retry')"
            >
              Coba Lagi
            </BaseButton>
            <button
              v-if="showDismiss"
              @click="$emit('dismiss')"
              :class="dismissClass"
              class="text-sm font-medium hover:underline"
            >
              Tutup
            </button>
          </slot>
        </div>
      </div>

      <!-- Close Button -->
      <div v-if="closable" class="ml-auto pl-3">
        <button
          @click="$emit('close')"
          :class="closeButtonClass"
          class="inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from '../base/BaseButton.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: true
  },
  showRetry: {
    type: Boolean,
    default: false
  },
  showDismiss: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close', 'retry', 'dismiss']);

const typeStyles = {
  error: {
    container: 'bg-red-50 border border-red-200',
    icon: 'text-red-400',
    title: 'text-red-800',
    message: 'text-red-700',
    dismiss: 'text-red-600 hover:text-red-800',
    closeButton: 'text-red-500 hover:bg-red-100',
    iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  warning: {
    container: 'bg-yellow-50 border border-yellow-200',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    dismiss: 'text-yellow-600 hover:text-yellow-800',
    closeButton: 'text-yellow-500 hover:bg-yellow-100',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  info: {
    container: 'bg-blue-50 border border-blue-200',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    message: 'text-blue-700',
    dismiss: 'text-blue-600 hover:text-blue-800',
    closeButton: 'text-blue-500 hover:bg-blue-100',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  success: {
    container: 'bg-green-50 border border-green-200',
    icon: 'text-green-400',
    title: 'text-green-800',
    message: 'text-green-700',
    dismiss: 'text-green-600 hover:text-green-800',
    closeButton: 'text-green-500 hover:bg-green-100',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }
};

const currentStyle = computed(() => typeStyles[props.type]);

const alertClasses = computed(() => currentStyle.value.container);
const iconClass = computed(() => currentStyle.value.icon);
const titleClass = computed(() => currentStyle.value.title);
const messageClass = computed(() => {
  return props.title ? `${currentStyle.value.message} mt-1` : currentStyle.value.message;
});
const dismissClass = computed(() => currentStyle.value.dismiss);
const closeButtonClass = computed(() => currentStyle.value.closeButton);
const iconPath = computed(() => currentStyle.value.iconPath);
</script>