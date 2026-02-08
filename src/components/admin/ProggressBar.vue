 <template>
  <div class="w-full">
    <div v-if="showLabel" class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span class="text-sm font-semibold text-gray-900">
        {{ percentage }}%
      </span>
    </div>

    <div :class="containerClasses" class="relative overflow-hidden">
      <div
        :class="barClasses"
        :style="barStyles"
        class="h-full transition-all duration-300 ease-out"
      >
        <div
          v-if="animated"
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
        />
      </div>
    </div>

    <p v-if="helperText" class="mt-2 text-xs text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    default: 100
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg', 'xl'].includes(v)
  },
  color: {
    type: String,
    default: 'blue',
    validator: v =>
      ['blue', 'green', 'yellow', 'red', 'purple', 'gradient'].includes(v)
  },
  rounded: {
    type: String,
    default: 'full',
    validator: v => ['none', 'sm', 'md', 'lg', 'full'].includes(v)
  },
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  helperText: {
    type: String,
    default: ''
  },
  animated: {
    type: Boolean,
    default: true
  }
});

const percentage = computed(() => {
  if (props.max <= 0) return 0;
  return Math.min(
    Math.round((props.value / props.max) * 100),
    100
  );
});

const containerClasses = computed(() => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };

  const rounded = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return [
    'w-full bg-gray-200',
    sizes[props.size],
    rounded[props.rounded]
  ].join(' ');
});

const barClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600'
  };

  return `relative ${colors[props.color]}`;
});

const barStyles = computed(() => ({
  width: `${percentage.value}%`
}));
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
