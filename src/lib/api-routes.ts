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
} as const;
