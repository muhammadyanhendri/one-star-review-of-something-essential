// One-Star Review of Something Essential — entry program (draft).
//
// Writes one deadpan one-star review, a single line of at most 160
// characters, of an everyday essential everyone relies on, to
// /output/entry.txt.
//
// Node 22, no dependencies. The review is a fixed constant, so every run
// produces identical bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The review, revised: "drops everything I own" states the grievance
// plainly, "chips every phone" makes it specific and true for everyone,
// and the turn lands in the last clause, gravity as a rude houseguest
// that never apologises and never helps clean up. No exclamation mark,
// no wink, no second joke.
const ENTRY =
  "Gravity drops everything I own, chips every phone I've ever bought, and has never once apologised or offered to help pick it up.";

const MAX_CHARS = 160;

function validate(entry: string): void {
  const chars = [...entry];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${chars.length}`);
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (entry !== entry.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (/\s{2,}/.test(entry)) {
    throw new Error("entry must not contain repeated whitespace");
  }
  if (!/^[\x20-\x7E]*$/.test(entry)) {
    throw new Error("entry must be plain printable ASCII");
  }
  if (Buffer.from(entry, "utf8").toString("utf8") !== entry) {
    throw new Error("entry must be valid UTF-8");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

function main(): void {
  validate(ENTRY);
  const chars = [...ENTRY];
  const bytes = Buffer.from(ENTRY, "utf8");

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, ENTRY, "utf8");

  // Read back and verify byte-for-byte.
  const back = readFileSync(outFile, "utf8");
  if (back !== ENTRY) {
    throw new Error("verification failed: file content differs from entry");
  }
  console.log(`wrote ${outFile}: ${chars.length} chars, ${bytes.length} bytes`);
}

main();
