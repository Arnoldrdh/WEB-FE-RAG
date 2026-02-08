import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect root to home
    {
      path: '/',
      redirect: '/home'
    },

    // Public Route - Chat/Home
    {
      path: '/home',
      name: 'chat',
      component: () => import('@/views/users/ChatView.vue'),
      meta: {
        title: 'KnowledgeDesk - AI Assistant',
        requiresAuth: false
      }
    },

    // Admin Login - Public (Must be outside admin children)
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
      meta: {
        title: 'Admin Login - KnowledgeDesk',
        requiresAuth: false,
        hideForAuth: true // Redirect jika sudah login
      }
    },

    // Admin Routes - All Protected
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
          meta: {
            title: 'Dashboard - KnowledgeDesk Admin',
            requiresAuth: true,
            requiresAdmin: true
          }
        },
        {
          path: 'documents',
          name: 'admin-documents',
          component: () => import('@/views/admin/DocumentView.vue'),
          meta: {
            title: 'Documents - KnowledgeDesk Admin',
            requiresAuth: true,
            requiresAdmin: true
          }
        }
      ]
    },

    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/admin/NotFoundView.vue'),
      meta: {
        title: '404 - Page Not Found'
      }
    }
  ]
});

// ============================================
// NAVIGATION GUARDS - Admin Protection
// ============================================

router.beforeEach(async (to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'KnowledgeDesk';

  //  FIX: Dynamic import authService to avoid circular dependency
  const { default: authService } = await import('@/services/authService');

  // Get authentication status
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Debug log (only in development)
  if (import.meta.env.DEV) {
    console.log(' Navigation Guard:', {
      from: from.name || from.path,
      to: to.name || to.path,
      requiresAuth: to.meta.requiresAuth,
      isAuthenticated,
      user: currentUser?.username
    });
  }

  // CASE 1: Protected Admin Route - Requires Authentication
  if (to.meta.requiresAuth || to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      console.warn(' Access denied: Authentication required');
      
      // Save the intended destination
      const redirectPath = to.fullPath;
      
      // Redirect to login with query parameter
      next({
        name: 'admin-login',
        query: { 
          redirect: redirectPath,
          reason: 'auth_required'
        }
      });
      return;
    }

    // User is authenticated, allow access
    console.log(' Access granted to admin area');
    next();
    return;
  }

  // CASE 2: Login page when already authenticated
  if (to.meta.hideForAuth && isAuthenticated) {
    console.log('ℹ Already authenticated, redirecting to dashboard');
    
    // Check if there's a redirect query
    const redirectTo = to.query.redirect || '/admin/dashboard';
    
    next(redirectTo);
    return;
  }

  // CASE 3: Public routes - Allow access
  next();
});

// Optional: After each navigation
router.afterEach((to, from) => {
  // Log successful navigation
  if (import.meta.env.DEV) {
    console.log('✓ Navigated to:', to.name || to.path);
  }
});

// Optional: Handle navigation errors
router.onError((error) => {
  console.error('Router Error:', error);
});

export default router;