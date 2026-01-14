import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'chat',
      component: () => import('@/views/users/ChatView.vue'),
      meta: {
        title: 'KnowledgeDesk - AI Assistant'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
          meta: {
            title: 'Dashboard - KnowledgeDesk Admin',
            requiresAuth: false
          }
        },
        {
          path: 'documents',
          name: 'admin-documents',
          component: () => import('@/views/admin/DocumentView.vue'),
          meta: {
            title: 'Documents - KnowledgeDesk Admin',
            requiresAuth: false
          }
        },
        {
          path: 'login',
          name: 'login-admin',
          component: () => import('@/views/admin/LoginView.vue'),
          meta: {
            title: 'Admin Login - KnowledgeDesk Admin',
            requiresAuth: false
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/admin/NotFoundView.vue')
    }
  ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'KnowledgeDesk';

  // Check authentication for admin routes
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // Redirect to login or home
      next({ name: 'chat' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;