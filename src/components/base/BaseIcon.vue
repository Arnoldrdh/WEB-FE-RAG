<template>
  <span :class="iconClasses" :style="iconStyles">
    <svg
      :width="size"
      :height="size"
      :viewBox="viewBox"
      :fill="fill"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      xmlns="http://www.w3.org/2000/svg"
    >
      <component :is="iconComponent" />
    </svg>
  </span>
</template>

<script setup>
import { computed, h } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  fill: {
    type: String,
    default: 'none'
  },
  stroke: {
    type: String,
    default: 'currentColor'
  },
  strokeWidth: {
    type: [String, Number],
    default: 2
  },
  viewBox: {
    type: String,
    default: '0 0 24 24'
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

// Icon library - Define common icons
const icons = {
  'home': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  }),
  'search': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
  }),
  'upload': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
  }),
  'download': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  }),
  'document': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  }),
  'check': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M5 13l4 4L19 7'
  }),
  'x': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M6 18L18 6M6 6l12 12'
  }),
  'trash': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
  }),
  'edit': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  }),
  'settings': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }),
  'user': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  }),
  'chat': () => h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
  })
};

const iconComponent = computed(() => {
  return icons[props.name] || (() => h('path', { d: '' }));
});

const iconClasses = computed(() => {
  const classes = ['inline-flex items-center justify-center'];
  
  if (props.clickable) {
    classes.push('cursor-pointer hover:opacity-75 transition-opacity');
  }
  
  return classes.join(' ');
});

const iconStyles = computed(() => ({
  color: props.color
}));

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event);
  }
};
</script>