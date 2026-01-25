import { loadCoreSpec } from "./config";
import { appendMemory } from "./memory";

const coreSpec = loadCoreSpec();

export interface PlanStep {
  id: string;
  description: string;
  status: "pending" | "in_progress" | "done" | "failed";
}

export interface Plan {
  goal: string;
  steps: PlanStep[];
}

export function getStatus() {
  const status = {
    id: coreSpec.id,
    name: coreSpec.identity?.name,
    version: coreSpec.version,
    mission: coreSpec.mission?.primary_goal,
    timestamp: new Date().toISOString()
  };

  appendMemory({
    timestamp: new Date().toISOString(),
    type: "status",
    data: status
  });

  return status;
}

export function planForGoal(goal: string): Plan {
  const steps: PlanStep[] = [
    {
      id: "analyze",
      description: `Analyze the goal: ${goal}`,
      status: "pending"
    },
    {
      id: "design",
      description: "Design a multi-step approach using available tools.",
      status: "pending"
    },
    {
      id: "execute",
      description: "Execute selected steps with human approval where required.",
      status: "pending"
    },
    {
      id: "report",
      description: "Produce a concise report of actions and outcomes.",
      status: "pending"
    }
  ];

  const plan: Plan = { goal, steps };
  appendMemory({
    timestamp: new Date().toISOString(),
    type: "plan",
    data: { goal, steps }
  });
  return plan;
}

export async function runTask(goal: string) {
  const plan = planForGoal(goal);
  appendMemory({
    timestamp: new Date().toISOString(),
    type: "task",
    data: { goal, status: "accepted" }
  });
  return {
    goal,
    plan,
    note: "Execution engine not yet implemented. This is a stub."
  };
}
