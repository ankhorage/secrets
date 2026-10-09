import { isCapabilityCatalog, normalizeCapabilityCatalog } from '@ankhorage/capability';
import type {
  SecretGetMetadataInput,
  SecretListInput,
  SecretMetadata,
} from '@ankhorage/contracts/secrets';
import { describe, expect, test } from 'bun:test';

import { CAPABILITIES } from '../src/capabilities/index.js';

describe('CAPABILITIES', () => {
  test('publishes only the provider-neutral, value-free metadata catalog', () => {
    expect(isCapabilityCatalog(CAPABILITIES)).toBeTrue();
    expect(normalizeCapabilityCatalog(CAPABILITIES).map(({ id }) => id)).toEqual([
      'secrets.getMetadata',
      'secrets.list',
    ]);
    expect(JSON.stringify(CAPABILITIES)).not.toContain('resolve');
    expect(JSON.stringify(CAPABILITIES)).not.toContain('payload');
    expect(JSON.stringify(CAPABILITIES)).not.toContain('execution');
    expect(JSON.stringify(CAPABILITIES)).not.toContain('supabase');
  });

  test('describes the published Contracts inputs and value-free metadata output', () => {
    const listInput = {
      scope: { projectId: 'atlas', environment: 'production' },
    } satisfies SecretListInput;
    const getMetadataInput = {
      scope: listInput.scope,
      ref: 'services/atlas',
    } satisfies SecretGetMetadataInput;
    const metadata = {
      ref: getMetadataInput.ref,
      scope: getMetadataInput.scope,
      kind: 'service',
      configuredFields: ['token'],
      createdAt: '2026-10-09T00:00:00.000Z',
      updatedAt: '2026-10-09T00:00:00.000Z',
    } satisfies SecretMetadata;

    expect(listInput.scope.projectId).toBe('atlas');
    expect(metadata.configuredFields).toEqual(['token']);
    expect(metadata).not.toHaveProperty('payload');
  });
});
