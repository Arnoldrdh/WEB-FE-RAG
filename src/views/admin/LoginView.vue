<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '@/services/authService';

const router = useRouter();
const route  = useRoute();

const username       = ref('');
const password       = ref('');
const error          = ref('');
const loading        = ref(false);
const showPassword   = ref(false);
const authRequired   = ref(route.query.reason === 'auth_required');
const sessionExpired = ref(route.query.reason === 'session_expired');

onMounted(() => {
  if (import.meta.env.DEV) {
    username.value = import.meta.env.VITE_ADMIN_USERNAME || '';
    password.value = import.meta.env.VITE_ADMIN_PASSWORD || '';
  }
});

const handleLogin = async () => {
  error.value = '';
  if (!username.value || !password.value) { error.value = 'Please enter username and password'; return; }
  loading.value = true;
  try {
    const result = await authService.login(username.value, password.value);
    if (result.success) {
      setTimeout(() => router.push(route.query.redirect || '/admin/dashboard'), 300);
    } else {
      error.value = result.error || 'Invalid credentials';
      password.value = '';
    }
  } catch { error.value = 'Login failed. Please try again.'; }
  finally { loading.value = false; }
};

const togglePasswordVisibility = () => { showPassword.value = !showPassword.value; };
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center bg-[#0c1a2e] overflow-hidden px-4 py-8">

    <!-- Orbs -->
    <div class="pointer-events-none fixed top-[-120px] left-[-100px] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(29,111,164,0.18),transparent_70%)] blur-[80px]"></div>
    <div class="pointer-events-none fixed bottom-[-80px] right-[-60px] w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.14),transparent_70%)] blur-[80px]"></div>
    <div class="pointer-events-none fixed bottom-[30%] left-[10%] w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(30,64,175,0.12),transparent_70%)] blur-[80px]"></div>

    <!-- Glass card -->
    <div class="relative z-10 w-full max-w-[400px] bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-[20px] px-8 py-10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">

      <!-- Header -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-12 h-12 rounded-[14px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 shadow-[0_4px_16px_rgba(13,148,136,0.3)] mb-4">
          <svg width="22" height="22" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h1 class="text-[1.6rem] font-bold text-white tracking-tight mb-1">KnowledgeDesk</h1>
        <p class="text-[0.72rem] text-white/40 uppercase tracking-[0.1em]">Admin Portal</p>
      </div>

      <!-- Session expired alert -->
      <div v-if="sessionExpired" class="flex items-center gap-2 px-3 py-2.5 mb-5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[0.78rem]">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span>Your session has expired. Please login again.</span>
      </div>

      <!-- Auth required alert -->
      <div v-else-if="authRequired" class="flex items-center gap-2 px-3 py-2.5 mb-5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 text-[0.78rem]">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Please login to access admin area</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">

        <!-- Username -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[0.72rem] font-medium text-white/50 tracking-wide">Username</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-white/25 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <input
              v-model="username" type="text" placeholder="Enter your username"
              autocomplete="username" :disabled="loading"
              class="w-full pl-9 pr-4 py-2.5 bg-white/[0.07] border border-white/[0.12] rounded-[10px] text-white text-sm placeholder-white/20 outline-none transition-all duration-200 focus:border-teal-500/60 focus:bg-white/10 focus:ring-2 focus:ring-teal-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[0.72rem] font-medium text-white/50 tracking-wide">Password</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-white/25 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <input
              v-model="password" :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password" autocomplete="current-password" :disabled="loading"
              class="w-full pl-9 pr-10 py-2.5 bg-white/[0.07] border border-white/[0.12] rounded-[10px] text-white text-sm placeholder-white/20 outline-none transition-all duration-200 focus:border-teal-500/60 focus:bg-white/10 focus:ring-2 focus:ring-teal-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button type="button" @click="togglePasswordVisibility" :disabled="loading" tabindex="-1"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition disabled:cursor-not-allowed">
              <svg v-if="!showPassword" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[0.78rem]">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="loading"
          class="mt-1 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 active:scale-[0.99] text-white text-[0.9rem] font-semibold rounded-[10px] shadow-[0_4px_14px_rgba(13,148,136,0.25)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
            <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Back link -->
      <div class="mt-7 text-center">
        <a href="/home" class="inline-flex items-center gap-1.5 text-[0.78rem] text-white/30 hover:text-white/60 transition">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Chat
        </a>
      </div>
    </div>
  </div>
</template>