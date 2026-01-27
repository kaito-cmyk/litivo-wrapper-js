import { spawn } from 'child_process';
import { existsSync } from 'fs';

type OpenOpts =
  | { url: string }
  | { exePath: string; args?: string[] };

export async function openLitivo(opts: OpenOpts): Promise<void> {
  return new Promise((resolve, reject) => {
    // Abrir por URL/protocolo (p.ej. litivo://...)
    if ('url' in opts) {
      const url = opts.url;
      // Windows: usar "start" para abrir el protocolo predeterminado
      const child = spawn('cmd', ['/c', 'start', '""', url], { detached: true, stdio: 'ignore' });
      child.on('error', reject);
      child.unref();
      return resolve();
    }

    // Abrir ejecutable directamente
    const exe = opts.exePath;
    if (!existsSync(exe)) {
      return reject(new Error(`No existe el ejecutable: ${exe}`));
    }
    const args = opts.args ?? [];
    const child = spawn(exe, args, { detached: true, stdio: 'ignore' });
    child.on('error', reject);
    child.unref();
    resolve();
  });
}
