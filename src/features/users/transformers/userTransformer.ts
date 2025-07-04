import type { User, UserData } from '..';
import type {
  ProfileRow,
  ProfileInsertDbData,
  ProfileUpdateDbData,
} from '../types/database';

// Type for the user_metadata JSONB column
type UserMetadata = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  location?: {
    lat: number;
    lng: number;
  };
};

/**
 * Transforms a database profile record to a domain user object
 */
export function toDomainUser(profile: ProfileRow): User {
  const metadata = (profile.user_metadata || {}) as UserMetadata;
  const { first_name, last_name, full_name, avatar_url, location } = metadata;

  return {
    id: profile.id,
    email: profile.email || '',
    firstName: first_name || '',
    lastName: last_name,
    fullName: full_name,
    avatarUrl: avatar_url,
    location,
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at),
  };
}

/**
 * Prepares user data for database insertion into profiles table
 */
export function forDbInsert(userData: UserData): ProfileInsertDbData {
  const { id, email, firstName, lastName, fullName, avatarUrl, location } =
    userData;

  const user_metadata: UserMetadata = {
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    avatar_url: avatarUrl,
    location,
  };

  return {
    id,
    email,
    user_metadata,
  };
}

/**
 * Prepares user data for updating the profiles table
 */
export function forDbUpdate(
  userData: Partial<UserData> & { id: string },
): ProfileUpdateDbData {
  return {
    user_metadata: createUserMetadata(userData),
    updated_at: new Date().toISOString(),
  };
}

// Export types for testing
export type {
  ProfileRow as UserRow,
  ProfileInsertDbData as UserInsertDbData,
  ProfileUpdateDbData as UserUpdateDbData,
};

// Helper function to create a user metadata object from user data
/**
 * @internal
 */
export function createUserMetadata(userData: Partial<UserData>): UserMetadata {
  const { firstName, lastName, fullName, avatarUrl, location } = userData;

  return {
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    avatar_url: avatarUrl,
    location,
  };
}
