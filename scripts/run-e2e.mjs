/* global fetch */
import { spawn } from 'node:child_process';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';

const run = (args, options = {}) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, args, { stdio: 'inherit', ...options });
  child.once('error', reject);
  child.once('exit', (code) => resolve(code ?? 1));
});

const buildCode = await run(['./node_modules/astro/bin/astro.mjs', 'build']);
if (buildCode !== 0) process.exit(buildCode);

const server = spawn(process.execPath, ['./scripts/serve-dist.mjs'], { stdio: 'inherit' });

try {
  const deadline = Date.now() + 10_000;
  while (true) {
    try {
      const response = await fetch('http://127.0.0.1:4321');
      if (response.ok) break;
    } catch {
      if (Date.now() >= deadline) throw new Error('Test server did not start in time.');
      await delay(100);
    }
  }

  const testCode = await run(['./node_modules/@playwright/test/cli.js', 'test']);
  process.exitCode = testCode;
} finally {
  server.kill();
}
