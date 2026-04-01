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
    search: '/users',
    publicProfile: (id: string) => `/users/${id}`,
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
    history: '/sessions',
  },
  stats: {
    exerciseHistory: (exerciseId: string) => `/stats/exercises/${exerciseId}/history`,
    volume: '/stats/volume',
    muscles: '/stats/muscles',
  },
  social: {
    follow: (userId: string) => `/social/follow/${userId}`,
    unfollow: (userId: string) => `/social/follow/${userId}`,
    followers: (userId: string) => `/social/followers/${userId}`,
    following: (userId: string) => `/social/following/${userId}`,
  },
  feed: {
    list: '/feed',
    create: '/feed/posts',
    post: (postId: string) => `/feed/posts/${postId}`,
    reactions: (postId: string) => `/feed/posts/${postId}/reactions`,
    removeReaction: (postId: string) => `/feed/posts/${postId}/reactions`,
    comments: (postId: string) => `/feed/posts/${postId}/comments`,
  },
} as const;
