export const API_ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    google: '/auth/callback',
  },
  users: {
    me: '/users/me',
    avatar: '/users/me/avatar',
  },
  exercises: {
    list: '/exercises',
    detail: (id: string) => `/exercises/${id}`,
  },
  workoutPlans: {
    list: '/workout-plans',
    active: '/workout-plans/active',
    detail: (id: string) => `/workout-plans/${id}`,
    activate: (id: string) => `/workout-plans/${id}/activate`,
  },
} as const;
