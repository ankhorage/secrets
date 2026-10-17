import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'bun:test';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));

test('installs the packed package into a fresh consumer and imports its public entry points', async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'secrets-consumer-'));
  const packageDirectory = join(temporaryDirectory, 'package');
  const consumerDirectory = join(temporaryDirectory, 'consumer');

  try {
    await run(['bun', 'pm', 'pack', '--destination', packageDirectory, '--quiet'], repositoryRoot);
    const [tarball] = await readdir(packageDirectory);
    if (tarball === undefined) throw new Error('Expected the packed package tarball.');
    await mkdir(consumerDirectory, { recursive: true });
    await writeFile(
      join(consumerDirectory, 'package.json'),
      JSON.stringify({ name: 'secrets-consumer', private: true, type: 'module' }),
    );
    await run(['bun', 'add', `file:${join(packageDirectory, tarball)}`], consumerDirectory);
    const result = await run(
      [
        'bun',
        '--eval',
        "import { existsSync, readFileSync } from 'node:fs'; import { dirname, join } from 'node:path'; import { CAPABILITIES } from '@ankhorage/secrets/capabilities'; import { normalizeSecretRef } from '@ankhorage/secrets/port'; const secretsEntry = await Bun.resolve('@ankhorage/secrets/port', import.meta.dir); const contractsEntry = await Bun.resolve('@ankhorage/contracts/secrets', import.meta.dir); const secretsRoot = dirname(dirname(dirname(secretsEntry))); const contractsRoot = dirname(dirname(contractsEntry)); console.log(JSON.stringify({ capabilitiesLength: CAPABILITIES.length, normalizedRef: normalizeSecretRef('/services/atlas/').data, contractsVersion: JSON.parse(readFileSync(join(contractsRoot, 'package.json'), 'utf8')).version, hasNestedContracts: existsSync(join(secretsRoot, 'node_modules', '@ankhorage', 'contracts')) }));",
      ],
      consumerDirectory,
    );

    expect(result.exitCode).toBe(0);
    const packageManifest = JSON.parse(
      await readFile(join(repositoryRoot, 'package.json'), 'utf8'),
    ) as { readonly dependencies: { readonly '@ankhorage/contracts': string } };
    const expectedContractsMajor =
      packageManifest.dependencies['@ankhorage/contracts'].match(/^\^(\d+)\./u)?.[1];
    if (expectedContractsMajor === undefined) {
      throw new Error('Expected the declared Contracts dependency to use a caret major range.');
    }
    const consumerResult = JSON.parse(result.stdout) as {
      readonly capabilitiesLength: number;
      readonly normalizedRef: string;
      readonly contractsVersion: string;
      readonly hasNestedContracts: boolean;
    };

    expect(consumerResult.capabilitiesLength).toBe(2);
    expect(consumerResult.normalizedRef).toBe('services/atlas');
    expect(consumerResult.contractsVersion.startsWith(`${expectedContractsMajor}.`)).toBeTrue();
    expect(consumerResult.hasNestedContracts).toBeFalse();
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
});

/*** Run one command in an isolated fresh-consumer directory. */
async function run(
  command: string[],
  cwd: string,
): Promise<{ readonly exitCode: number; readonly stdout: string }> {
  const process = Bun.spawn(command, { cwd, stderr: 'pipe', stdout: 'pipe' });
  const exitCode = await process.exited;
  const stdout = await new Response(process.stdout).text();
  if (exitCode !== 0) {
    throw new Error(await new Response(process.stderr).text());
  }
  return { exitCode, stdout };
}
