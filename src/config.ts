import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const ROOT = path.resolve(__dirname, "..");

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  llmProvider: process.env.LLM_PROVIDER || "none",
  llmModel: process.env.LLM_MODEL || "",
  llmApiKey: process.env.LLM_API_KEY || "",
  selfEditToken: process.env.SELF_EDIT_TOKEN || ""
};

export type CoreSpec = ReturnType<typeof loadCoreSpec>;

export function loadCoreSpec() {
  const specPath = path.join(ROOT, "prime_forge_core.json");
  const raw = fs.readFileSync(specPath, "utf8");
  const parsed = JSON.parse(raw);
  return parsed;
}

export const paths = {
  root: ROOT,
  memoryFile: path.join(ROOT, "data", "memory.jsonl"),
  logFile: path.join(ROOT, "logs", "prime-forge.log")
};
