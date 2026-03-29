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
  sessions: {
    start: '/sessions',
    active: '/sessions/active',
    cancel: '/sessions/active',
    detail: (id: string) => `/sessions/${id}`,
    logSet: (id: string) => `/sessions/${id}/sets`,
    replaceExercise: (id: string, exerciseId: string) => `/sessions/${id}/exercises/${exerciseId}`,
    finish: (id: string) => `/sessions/${id}/finish`,
  },
} as const;
