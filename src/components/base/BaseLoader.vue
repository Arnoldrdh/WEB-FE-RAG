<template>
  <div :class="containerClasses">
    <div v-if="type === 'spinner'" :class="spinnerClasses">
      <svg class="animate-spin" :width="size" :height="size" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="type === 'dots'" class="flex space-x-2">
      <div v-for="i in 3" :key="i" :class="dotClasses" :style="{ animationDelay: `${(i - 1) * 150}ms` }"></div>
    </div>

    <div v-else-if="type === 'pulse'" :class="pulseClasses"></div>

    <div v-else-if="type === 'bars'" class="flex space-x-1">
      <div v-for="i in 3" :key="i" :class="barClasses" :style="{ animationDelay: `${(i - 1) * 150}ms` }"></div>
    </div>

    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['spinner', 'dots', 'pulse', 'bars'].includes(value)
  },
  size: {
    type: [String, Number],
    default: 40
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'gray', 'green', 'red', 'purple', 'white'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  }
});

const colorClasses = {
  blue: 'text-blue-600',
  gray: 'text-gray-600',
  green: 'text-green-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
  white: 'text-white'
};

const containerClasses = computed(() => {
  const classes = ['flex flex-col items-center justify-center'];
  
  if (props.fullscreen) {
    classes.push('fixed inset-0 z-50');
  }
  
  if (props.overlay) {
    classes.push('bg-white/80 backdrop-blur-sm');
  }
  
  return classes.join(' ');
});

const spinnerClasses = computed(() => {
  return [colorClasses[props.color]].join(' ');
});

const dotClasses = computed(() => {
  const bgColors = {
    blue: 'bg-blue-600',
    gray: 'bg-gray-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    white: 'bg-white'
  };
  
  return [
    'w-2 h-2 rounded-full animate-bounce',
    bgColors[props.color]
  ].join(' ');
});

const pulseClasses = computed(() => {
  const bgColors = {
    blue: 'bg-blue-600',
    gray: 'bg-gray-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    white: 'bg-white'
  };
  
  return [
    'rounded-full animate-pulse',
    bgColors[props.color]
  ].join(' ') + ` w-${props.size / 4} h-${props.size / 4}`;
});

const barClasses = computed(() => {
  const bgColors = {
    blue: 'bg-blue-600',
    gray: 'bg-gray-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    white: 'bg-white'
  };
  
  return [
    'w-1 h-8 rounded-full animate-bar',
    bgColors[props.color]
  ].join(' ');
});

const textClasses = computed(() => {
  return [
    'mt-3 text-sm font-medium',
    colorClasses[props.color]
  ].join(' ');
});
</script>

<style scoped>
@keyframes bar {
  0%, 100% {
    height: 1rem;
  }
  50% {
    height: 2rem;
  }
}

.animate-bar {
  animation: bar 1s ease-in-out infinite;
}
</style>