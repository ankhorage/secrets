/*** Expose the canonical trusted secret-store execution boundary without duplicating Contracts semantics. */
export type {
  KnownSecretStoreProvider,
  SecretCreateInput,
  SecretGetMetadataInput,
  SecretListInput,
  SecretMetadata,
  SecretPayload,
  SecretRef,
  SecretRemoveInput,
  SecretReplaceInput,
  SecretResolveInput,
  SecretScope,
  SecretStoreAdapter,
  SecretStoreError,
  SecretStoreErrorCode,
  SecretStoreOkResult,
  SecretStoreProvider,
  SecretStoreResult,
} from '@ankhorage/contracts/secrets';
export {
  normalizeSecretRef,
  normalizeSecretScope,
  validateSecretPayload,
} from '@ankhorage/contracts/secrets';
