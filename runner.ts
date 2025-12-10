export class c {
  static normal = "\x1b[0m";
  static yellow = (t: string) => "\x1b[33m" + t + this.normal;
  static cyan = (t: string) => "\x1b[36m" + t + this.normal;
  static green = (t: string) => "\x1b[32m" + t + this.normal;
  static blue = (t: string) => "\x1b[34m" + t + this.normal;
  static magenta = (t: string) => "\x1b[35m" + t + this.normal;
  static purple = (t: string) => "\x1b[95m" + t + this.normal;
}

function runCommand(prefix: string, command: string[]) {
  const proc = Bun.spawn(command, {
    stdout: "pipe",
    stderr: "pipe",
  });

  pipeOutput(proc.stdout, prefix);
  pipeOutput(proc.stderr, prefix);
}

async function pipeOutput(stream: ReadableStream<Uint8Array>, prefix: string) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log(`${prefix} ${decoder.decode(value).trimEnd()}`);
  }
}

const vite = runCommand(`[${c.purple("vite")}] `, ["bun", "run", "dev:vite"]);
const partykit = runCommand(`[${c.yellow("partykit")}]`, ["bun", "run", "dev:partykit"]);

if (Bun.env.PARTYKIT_ENABLED) {
  await Promise.all([vite, partykit]);
} else {
  await Promise.all([vite]);
}
