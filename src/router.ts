import { Router, Request, Response } from "express";
import { getStatus, planForGoal, runTask } from "./agent";
import { queryMemory } from "./memory";
import { simulateEdit, applyEdit, EditRequest } from "./selfEdit";
import { env } from "./config";

export const router = Router();

router.get("/status", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    status: getStatus()
  });
});

router.post("/plan", (req: Request, res: Response) => {
  const { goal } = req.body || {};
  if (!goal || typeof goal !== "string") {
    return res.status(400).json({ ok: false, error: "goal (string) required" });
  }
  const plan = planForGoal(goal);
  res.json({ ok: true, plan });
});

router.post("/run-task", async (req: Request, res: Response) => {
  const { goal } = req.body || {};
  if (!goal || typeof goal !== "string") {
    return res.status(400).json({ ok: false, error: "goal (string) required" });
  }
  const result = await runTask(goal);
  res.json({ ok: true, result });
});

router.get("/memory/query", (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
  const entries = queryMemory(limit);
  res.json({ ok: true, entries });
});

router.post("/self-edit/simulate", (req: Request, res: Response) => {
  const body = req.body as Partial<EditRequest>;
  if (
    !body.filePath ||
    !body.findText ||
    typeof body.filePath !== "string" ||
    typeof body.findText !== "string" ||
    typeof body.replaceText !== "string"
  ) {
    return res.status(400).json({ ok: false, error: "filePath, findText, replaceText required" });
  }
  const result = simulateEdit({
    filePath: body.filePath,
    findText: body.findText,
    replaceText: body.replaceText,
    justification: body.justification || ""
  });
  res.json({ ok: result.ok, result });
});

router.post("/self-edit/confirm", (req: Request, res: Response) => {
  const body = req.body as Partial<EditRequest> & { approvalToken?: string };

  if (!env.selfEditToken || body.approvalToken !== env.selfEditToken) {
    return res.status(403).json({ ok: false, error: "Invalid or missing approval token." });
  }

  if (
    !body.filePath ||
    !body.findText ||
    typeof body.filePath !== "string" ||
    typeof body.findText !== "string" ||
    typeof body.replaceText !== "string"
  ) {
    return res.status(400).json({ ok: false, error: "filePath, findText, replaceText required" });
  }

  const result = applyEdit({
    filePath: body.filePath,
    findText: body.findText,
    replaceText: body.replaceText,
    justification: body.justification || ""
  });
  res.json({ ok: result.ok, result });
});
