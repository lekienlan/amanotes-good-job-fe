import type { User } from 'domain/models';

/** Format user first_name + last_name for display (matches Prisma User shape). */
export const getDisplayName = (user: User | null | undefined): string => {
  if (!user) return '';
  const parts = [user.first_name, user.last_name].filter(Boolean);
  return parts.length ? parts.join(' ').trim() : user.email ?? '';
};
