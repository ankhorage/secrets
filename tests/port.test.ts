import {
  normalizeSecretRef,
  normalizeSecretScope,
  validateSecretPayload,
} from '@ankhorage/contracts/secrets';
import type {
  SecretMetadata as ContractsSecretMetadata,
  SecretPayload as ContractsSecretPayload,
  SecretScope as ContractsSecretScope,
  SecretStoreAdapter as ContractsSecretStoreAdapter,
  SecretStoreResult as ContractsSecretStoreResult,
} from '@ankhorage/contracts/secrets';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'bun:test';

import {
  normalizeSecretRef as normalizePortSecretRef,
  normalizeSecretScope as normalizePortSecretScope,
  validateSecretPayload as validatePortSecretPayload,
} from '../src/port/index.js';
import type {
  SecretMetadata,
  SecretPayload,
  SecretScope,
  SecretStoreAdapter,
  SecretStoreResult,
} from '../src/port/index.js';

describe('secret-store execution port', () => {
  test('re-exports the Contracts execution semantics by identity', () => {
    expect(normalizePortSecretRef).toBe(normalizeSecretRef);
    expect(normalizePortSecretScope).toBe(normalizeSecretScope);
    expect(validatePortSecretPayload).toBe(validateSecretPayload);
  });

  test('keeps port types assignable to the released Contracts contract', () => {
    const directContractsReuse = [
      true satisfies IsMutuallyAssignable<SecretScope, ContractsSecretScope>,
      true satisfies IsMutuallyAssignable<SecretPayload, ContractsSecretPayload>,
      true satisfies IsMutuallyAssignable<SecretMetadata, ContractsSecretMetadata>,
      true satisfies IsMutuallyAssignable<SecretStoreAdapter, ContractsSecretStoreAdapter>,
      true satisfies IsMutuallyAssignable<
        SecretStoreResult<SecretMetadata>,
        ContractsSecretStoreResult<ContractsSecretMetadata>
      >,
    ];

    expect(directContractsReuse).toEqual([true, true, true, true, true]);
  });

  test('contains only direct Contracts re-exports instead of local secret declarations', async () => {
    const source = await readFile(
      fileURLToPath(new URL('../src/port/index.ts', import.meta.url)),
      'utf8',
    );

    expect(source).toContain("from '@ankhorage/contracts/secrets'");
    expect(source).not.toMatch(
      /\b(?:interface|type)\s+(?:SecretMetadata|SecretPayload|SecretScope)\b/,
    );
  });
});

type IsMutuallyAssignable<Left, Right> = Left extends Right
  ? Right extends Left
    ? true
    : false
  : false;
