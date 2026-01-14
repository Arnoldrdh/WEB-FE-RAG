<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Prefix -->
      <div
        v-if="$slots.prefix || prefixIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="prefix">
          <span class="text-gray-400" v-html="prefixIcon"></span>
        </slot>
      </div>

      <!-- Input -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Suffix -->
      <div
        v-if="$slots.suffix || suffixIcon || showClear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <button
          v-if="showClear && modelValue"
          type="button"
          @click="clearInput"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <slot v-else name="suffix">
          <span v-if="suffixIcon" class="text-gray-400" v-html="suffixIcon"></span>
        </slot>
      </div>
    </div>

    <!-- Helper -->
    <p v-if="helperText && !error" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>

    <!-- Error -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue';

const slots = useSlots();

const props = defineProps({
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).slice(2, 9)}`
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  helperText: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  },
  prefixIcon: { type: String, default: '' },
  suffixIcon: { type: String, default: '' },
  showClear: Boolean,
  min: [String, Number],
  max: [String, Number],
  step: [String, Number],
  autocomplete: { type: String, default: 'off' }
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'clear']);
const isFocused = ref(false);

const inputClasses = computed(() => {
  const cls = [
    'block w-full border rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
    'placeholder-gray-400'
  ];

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  cls.push(sizes[props.size]);

  if (props.prefixIcon || slots.prefix) cls.push('pl-10');
  if (props.suffixIcon || slots.suffix || props.showClear) cls.push('pr-10');

  if (props.error) {
    cls.push('border-red-300 focus:border-red-500 focus:ring-red-500');
  } else if (isFocused.value) {
    cls.push('border-blue-500 ring-2 ring-blue-500/20');
  } else {
    cls.push('border-gray-300 focus:border-blue-500 focus:ring-blue-500');
  }

  return cls.join(' ');
});

const handleInput = e => emit('update:modelValue', e.target.value);
const handleBlur = e => {
  isFocused.value = false;
  emit('blur', e);
};
const handleFocus = e => {
  isFocused.value = true;
  emit('focus', e);
};
const clearInput = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>
