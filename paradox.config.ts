import { defineParadoxConfig } from '@ankhorage/paradox';

export default defineParadoxConfig({
  mode: 'write',
  package: {
    root: '.',
    entrypoints: ['src/capabilities/index.ts'],
  },
  output: {
    dir: './paradox',
  },
});
