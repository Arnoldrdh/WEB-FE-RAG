<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200">
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <slot name="header-actions" />
        </div>
      </slot>
    </div>

    <!-- Body -->
    <div :class="bodyClasses">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered', 'elevated', 'flat'].includes(value)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const cardClasses = computed(() => {
  const classes = ['bg-white overflow-hidden transition-all duration-200'];

  // Rounded variants
  const rounded = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl'
  };
  classes.push(rounded[props.rounded]);

  // Variant styles
  const variants = {
    default: 'border border-gray-200',
    bordered: 'border-2 border-gray-300',
    elevated: 'shadow-lg',
    flat: 'shadow-none'
  };
  classes.push(variants[props.variant]);

  // Interactive states
  if (props.hoverable) {
    classes.push('hover:shadow-xl');
  }
  
  if (props.clickable) {
    classes.push('cursor-pointer hover:shadow-xl active:scale-[0.98]');
  }

  return classes.join(' ');
});

const bodyClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  return paddings[props.padding];
});
</script>