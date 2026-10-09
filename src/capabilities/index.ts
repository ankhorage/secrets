import type { Capability } from '@ankhorage/contracts/capability';

/*** Publish provider-neutral, value-free secret metadata operations for discovery and binding. */
export const CAPABILITIES = [
  {
    id: 'secrets.list',
    owner: '@ankhorage/secrets',
    access: ['invoke'],
    binding: { kind: 'action', bindableAs: ['target'] },
    label: 'List secrets',
    description: 'List secret metadata without exposing secret values.',
    input: {
      schema: {
        type: 'object',
        required: ['scope'],
        properties: {
          scope: {
            type: 'object',
            required: ['projectId', 'environment'],
            properties: {
              projectId: { type: 'string' },
              environment: { type: 'string' },
            },
          },
          kind: { type: 'string' },
          provider: { type: 'string' },
        },
      },
    },
    output: {
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['ref', 'scope', 'kind', 'configuredFields', 'createdAt', 'updatedAt'],
          properties: {
            ref: { type: 'string' },
            scope: {
              type: 'object',
              required: ['projectId', 'environment'],
              properties: {
                projectId: { type: 'string' },
                environment: { type: 'string' },
              },
            },
            kind: { type: 'string' },
            provider: { type: 'string' },
            configuredFields: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  {
    id: 'secrets.getMetadata',
    owner: '@ankhorage/secrets',
    access: ['invoke'],
    binding: { kind: 'action', bindableAs: ['target'] },
    label: 'Get secret metadata',
    description: 'Get metadata for one secret without exposing its values.',
    input: {
      schema: {
        type: 'object',
        required: ['scope', 'ref'],
        properties: {
          scope: {
            type: 'object',
            required: ['projectId', 'environment'],
            properties: {
              projectId: { type: 'string' },
              environment: { type: 'string' },
            },
          },
          ref: { type: 'string' },
        },
      },
    },
    output: {
      schema: {
        type: 'object',
        required: ['ref', 'scope', 'kind', 'configuredFields', 'createdAt', 'updatedAt'],
        properties: {
          ref: { type: 'string' },
          scope: {
            type: 'object',
            required: ['projectId', 'environment'],
            properties: {
              projectId: { type: 'string' },
              environment: { type: 'string' },
            },
          },
          kind: { type: 'string' },
          provider: { type: 'string' },
          configuredFields: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
] as const satisfies readonly Capability[];
