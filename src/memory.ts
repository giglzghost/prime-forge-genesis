import fs from "fs";
import path from "path";
import { paths } from "./config";export interface MemoryEntry {
timestamp: string;
type: "plan" | "task" | "observation" | "status";
data: any;
}function ensureDir(filePath: string) {
const dir = path.dirname(filePath);
fs.mkdirSync(dir, { recursive: true });
}export function appendMemory(entry: MemoryEntry) {
const line = JSON.stringify(entry);
ensureDir(paths.memoryFile);
fs.appendFileSync(paths.memoryFile, line + "\n", "utf8");
}export function queryMemory(limit = 50): MemoryEntry[] {
if (!fs.existsSync(paths.memoryFile)) return [];
const raw = fs.readFileSync(paths.memoryFile, "utf8").trim();
if (!raw) return [];const lines = raw.split("\n");
const slice = lines.slice(-limit);return slice
.map((l) => {
try {
return JSON.parse(l);
} catch {
return null;
}
})
.filter(Boolean) as MemoryEntry[];
}
