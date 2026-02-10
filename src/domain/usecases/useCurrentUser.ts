import { useAuthStore } from 'data/store';

/**
 * Use case: expose current user to presentation.
 * Presentation must use this instead of calling useAuthStore directly.
 */
export const useCurrentUser = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  return { currentUser };
};
