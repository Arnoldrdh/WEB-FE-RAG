<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <!-- Icon/Illustration -->
    <div :class="iconContainerClass" class="rounded-full flex items-center justify-center mb-6">
      <slot name="icon">
        <svg :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
        </svg>
      </slot>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-900 mb-2 text-center">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-gray-500 text-center max-w-sm mb-6">
      {{ description }}
    </p>

    <!-- Action Button -->
    <div v-if="$slots.action || actionText" class="flex flex-col sm:flex-row gap-3">
      <slot name="action">
        <BaseButton
          v-if="actionText"
          :variant="actionVariant"
          @click="$emit('action')"
        >
          <template v-if="actionIcon" #icon-left>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="actionIcon" />
            </svg>
          </template>
          {{ actionText }}
        </BaseButton>
      </slot>
    </div>

    <!-- Secondary Action -->
    <div v-if="$slots.secondary || secondaryText" class="mt-4">
      <slot name="secondary">
        <button
          v-if="secondaryText"
          @click="$emit('secondary-action')"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
        >
          {{ secondaryText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from '../base/BaseButton.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'inbox',
    validator: (value) => ['inbox', 'document', 'search', 'folder', 'user', 'check', 'error'].includes(value)
  },
  iconSize: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  actionText: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: ''
  },
  actionVariant: {
    type: String,
    default: 'primary'
  },
  secondaryText: {
    type: String,
    default: ''
  }
});

defineEmits(['action', 'secondary-action']);

const iconPaths = {
  inbox: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
};

const iconPath = computed(() => iconPaths[props.icon]);

const iconContainerSizes = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24'
};

const iconSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12'
};

const iconContainerClass = computed(() => {
  return `${iconContainerSizes[props.iconSize]} bg-gray-100`;
});

const iconClass = computed(() => {
  return `${iconSizes[props.iconSize]} text-gray-400`;
});
</script>