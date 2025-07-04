import { faker } from '@faker-js/faker';
import { User, UserData } from '../types';
import { ProfileRow } from '../types/database';

/**
 * Creates a fake domain User object
 */
export function createFakeUser(overrides: Partial<User> = {}): User {
  const now = faker.date.recent();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName,
    lastName,
    avatarUrl: faker.image.avatar(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createFakeUserData(
  overrides: Partial<UserData> = {},
): UserData {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    fullName: faker.person.fullName(),
    avatarUrl: faker.image.avatar(),
    location: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
    ...overrides,
  };
}

export function createFakeDbProfile(
  overrides: Partial<ProfileRow> = {},
): ProfileRow {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const now = faker.date.recent().toISOString();

  return {
    id: faker.string.uuid(),
    created_at: now,
    updated_at: now,
    email: faker.internet.email(),
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      avatar_url: faker.image.avatar(),
      location: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
    },
    ...overrides,
  };
}
