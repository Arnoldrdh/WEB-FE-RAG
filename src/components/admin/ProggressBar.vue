<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex items-center justify-between mb-1.5">
      <span class="text-[0.75rem] font-medium text-white/50">{{ label }}</span>
      <span class="text-[0.75rem] font-semibold text-white/70">{{ percentage }}%</span>
    </div>

    <div :class="containerClasses" class="relative overflow-hidden">
      <div :class="barClasses" :style="barStyles" class="h-full transition-all duration-300 ease-out">
        <div v-if="animated" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"/>
      </div>
    </div>

    <p v-if="helperText" class="mt-1.5 text-[0.7rem] text-white/30">{{ helperText }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value:      { type: Number, required: true },
  max:        { type: Number, default: 100 },
  size:       { type: String, default: 'md', validator: v => ['sm','md','lg','xl'].includes(v) },
  color:      { type: String, default: 'blue', validator: v => ['blue','green','yellow','red','purple','gradient'].includes(v) },
  rounded:    { type: String, default: 'full', validator: v => ['none','sm','md','lg','full'].includes(v) },
  label:      { type: String, default: '' },
  showLabel:  { type: Boolean, default: false },
  helperText: { type: String, default: '' },
  animated:   { type: Boolean, default: true }
});

const percentage = computed(() => {
  if (props.max <= 0) return 0;
  return Math.min(Math.round((props.value / props.max) * 100), 100);
});

const containerClasses = computed(() => {
  const sizes   = { sm: 'h-1', md: 'h-2', lg: 'h-3', xl: 'h-4' };
  const rounded = { none: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' };
  return ['w-full bg-white/[0.08]', sizes[props.size], rounded[props.rounded]].join(' ');
});

const barClasses = computed(() => {
  const colors = {
    blue:     'bg-gradient-to-r from-blue-600 to-blue-500',
    green:    'bg-gradient-to-r from-emerald-600 to-emerald-500',
    yellow:   'bg-gradient-to-r from-amber-600 to-amber-500',
    red:      'bg-gradient-to-r from-red-600 to-red-500',
    purple:   'bg-gradient-to-r from-violet-600 to-violet-500',
    gradient: 'bg-gradient-to-r from-blue-600 to-teal-500',
  };
  return `relative ${colors[props.color]}`;
});

const barStyles = computed(() => ({ width: `${percentage.value}%` }));
</script>

<style scoped>
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer { animation: shimmer 2s infinite; }
</style>