import { useQuery } from '@tanstack/react-query';
import { logger, queryKeys, toRecords } from '@/shared';
import { useSupabase } from '@/shared';
import { fetchCommunities } from '@/features/communities/api';
import { STANDARD_CACHE_TIME } from '@/config';

import type { CommunityInfo, CommunityFilter } from '@/features/communities/types';

/**
 * Hook for fetching communities list.
 *
 * Provides community listing functionality with optional filtering.
 * Use separate mutation hooks for create/update/delete operations.
 *
 * @param filters - Optional filters to apply to the community list
 * @returns Query state for communities list
 *
 * @example
 * ```tsx
 * function CommunityList() {
 *   const { data: communities, isPending, error } = useCommunities();
 *
 *   if (isPending) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {communities?.map(community => (
 *         <div key={community.id}>{community.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With filters
 * function ActiveCommunities() {
 *   const { data: communities } = useCommunities({
 *     isActive: true,
 *     category: 'social'
 *   });
 *
 *   return (
 *     <div>
 *       {communities?.map(community => (
 *         <div key={community.id}>{community.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCommunities(filters?: CommunityFilter) {
  const supabase = useSupabase();

  const query = useQuery<CommunityInfo[], Error>({
    queryKey: filters
      ? queryKeys.communities.filtered(toRecords(filters))
      : queryKeys.communities.all,
    queryFn: () => fetchCommunities(supabase, filters),
    staleTime: STANDARD_CACHE_TIME,
  });

  if (query.error) {
    logger.error('🏘️ API: Error fetching communities', {
      error: query.error,
      filters,
    });
  }

  return query;
}
