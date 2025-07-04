import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { logger, queryKeys } from '@/shared';
import { useSupabase } from '@/shared';
import { createResource } from '@/features/resources/api';
import { useCurrentUser } from '@/features/auth';

import type { ResourceInfo, ResourceData } from '@/features/resources/types';

/**
 * Hook for creating a new resource.
 *
 * Provides a mutation function for creating resources (offers/requests).
 * Returns ResourceInfo (with ID references) rather than full composed Resource object.
 * Automatically invalidates resource caches on successful creation.
 *
 * @returns React Query mutation result with create function and state
 *
 * @example
 * ```tsx
 * function CreateResourceForm({ communityId }) {
 *   const { mutate, isLoading, error } = useCreateResource();
 *   const [formData, setFormData] = useState({
 *     type: 'offer',
 *     category: 'household',
 *     title: '',
 *     description: '',
 *     communityId,
 *   });
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     mutate(formData, {
 *       onSuccess: (resourceInfo) => {
 *         console.log('Created resource:', resourceInfo.title);
 *         // To get full composed Resource with owner and community objects:
 *         // const fullResource = useResource(resourceInfo.id);
 *         router.push(`/resources/${resourceInfo.id}`);
 *       },
 *       onError: (error) => {
 *         console.error('Failed to create resource:', error);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <select
 *         value={formData.type}
 *         onChange={(e) => setFormData({...formData, type: e.target.value})}
 *       >
 *         <option value="offer">Offer</option>
 *         <option value="request">Request</option>
 *       </select>
 *       <input
 *         value={formData.title}
 *         onChange={(e) => setFormData({...formData, title: e.target.value})}
 *         placeholder="Title"
 *       />
 *       <textarea
 *         value={formData.description}
 *         onChange={(e) => setFormData({...formData, description: e.target.value})}
 *         placeholder="Description"
 *       />
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? 'Creating...' : 'Create Resource'}
 *       </button>
 *       {error && <div className="error">{error.message}</div>}
 *     </form>
 *   );
 * }
 * ```
 */
export function useCreateResource() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const currentUser = useCurrentUser();

  const mutation = useMutation({
    mutationFn: async (data: ResourceData): Promise<ResourceInfo> => {
      if (!currentUser?.data?.id) {
        throw new Error('User must be authenticated to create resources');
      }

      // Create the resource (returns ResourceInfo)
      const result = await createResource(supabase, data);
      if (!result) {
        throw new Error('Failed to create resource');
      }
      return result;
    },
    onSuccess: (newResourceInfo: ResourceInfo) => {
      // Invalidate all resources queries
      queryClient.invalidateQueries({ queryKey: ['resources'] });

      // Cache the ResourceInfo for potential useResource calls
      queryClient.setQueryData(
        queryKeys.resources.byId(newResourceInfo.id),
        newResourceInfo,
      );

      logger.info('📚 API: Successfully created resource', {
        id: newResourceInfo.id,
        title: newResourceInfo.title,
      });
    },
    onError: (error) => {
      logger.error('📚 API: Failed to create resource', { error });
    },
  });

  // Return mutation with stable function references
  return {
    ...mutation,
    mutate: useCallback(
      (...args: Parameters<typeof mutation.mutate>) => {
        return mutation.mutate(...args);
      },
      [mutation],
    ),
    mutateAsync: useCallback(
      (...args: Parameters<typeof mutation.mutateAsync>) => {
        return mutation.mutateAsync(...args);
      },
      [mutation],
    ),
  };
}
