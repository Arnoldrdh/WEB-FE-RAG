<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">KnowledgeDesk</h1>
        <p class="text-gray-600">Admin Panel Login</p>
      </div>

      <!-- Login Card -->
      <BaseCard padding="lg" variant="elevated" rounded="2xl">
        <!-- Error Message -->
        <ErrorMessage
          v-if="error"
          type="error"
          :message="error"
          closable
          @close="error = null"
          class="mb-6"
        />

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <BaseInput
            v-model="credentials.email"
            type="email"
            label="Email"
            placeholder="admin@knowledgedesk.com"
            required
            :disabled="isLoading"
            :error="errors.email"
          >
            <template #prefix>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </template>
          </BaseInput>

          <!-- Password -->
          <BaseInput
            v-model="credentials.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="••••••••"
            required
            :disabled="isLoading"
            :error="errors.password"
          >
            <template #prefix>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </template>
            <template #suffix>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </template>
          </BaseInput>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="isLoading"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </BaseButton>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
          <div class="text-sm text-blue-800 space-y-1">
            <p><strong>Email:</strong> admin@demo.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
          <button
            @click="useDemoCredentials"
            class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Use Demo Credentials →
          </button>
        </div>
      </BaseCard>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <router-link
          to="/"
          class="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center space-x-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login as authLogin } from '@/utils/auth';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';

const router = useRouter();
const route = useRoute();

const credentials = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const error = ref(null);
const isLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

/**
 * Handle login form submission
 */
const handleLogin = async () => {
  // Clear previous errors
  error.value = null;
  errors.email = '';
  errors.password = '';
  
  // Validate
  if (!credentials.email) {
    errors.email = 'Email is required';
    return;
  }
  if (!credentials.password) {
    errors.password = 'Password is required';
    return;
  }
  
  isLoading.value = true;
  
  try {
    // TODO: Replace with actual API call
    // const result = await authApi.login(credentials.email, credentials.password);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo login logic
    if (credentials.email === 'admin@demo.com' && credentials.password === 'admin123') {
      // Successful login
      const token = 'demo_token_' + Date.now();
      const userData = {
        id: 1,
        email: credentials.email,
        name: 'Admin User',
        role: 'admin'
      };
      
      // Save auth data
      const expiresIn = rememberMe.value ? 604800 : 86400; // 7 days or 24 hours
      authLogin(token, userData, expiresIn);
      
      // Redirect to intended page or dashboard
      const redirectTo = route.query.redirect || '/admin/dashboard';
      router.push(redirectTo);
      
    } else {
      // Invalid credentials
      error.value = 'Invalid email or password';
    }
    
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.message || 'Login failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Use demo credentials
 */
const useDemoCredentials = () => {
  credentials.email = 'admin@demo.com';
  credentials.password = 'admin123';
};
</script>