import path from "path";
import express from "express";
import { env } from "./config";
import { router } from "./router";

const app = express();
app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "..", "public")));

app.use("/api", router);

app.get("/", (_req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", (_req, res) => {
  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Genesis Forge Dashboard</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 20px; background:#050712; color:#f5f5f5; }
    h1 { margin-bottom: 0.25rem; }
    .card { border:1px solid #333; border-radius:8px; padding:16px; margin-bottom:16px; background:#101322; }
    label { display:block; margin-top:8px; }
    textarea, input { width:100%; padding:8px; border-radius:4px; border:1px solid #444; background:#050712; color:#f5f5f5; }
    button { margin-top:8px; padding:8px 12px; border-radius:4px; border:none; background:#4f46e5; color:#fff; cursor:pointer; }
    button:disabled { opacity:0.6; cursor:not-allowed; }
    pre { background:#050712; padding:8px; border-radius:4px; max-height:200px; overflow:auto; }
  </style>
</head>
<body>
  <h1>Genesis Forge</h1>
  <p>Prime Forge Core controller – status, plans, tasks, and memory.</p>

  <div class="card">
    <h2>Status</h2>
    <button onclick="loadStatus()">Refresh status</button>
    <pre id="statusOutput">{}</pre>
  </div>

  <div class="card">
    <h2>Create Plan</h2>
    <label>Goal</label>
    <textarea id="planGoal" rows="3" placeholder="Describe your goal..."></textarea>
    <button onclick="createPlan()">Plan</button>
    <pre id="planOutput">{}</pre>
  </div>

  <div class="card">
    <h2>Run Task (Stub)</h2>
    <label>Goal</label>
    <textarea id="taskGoal" rows="3" placeholder="Describe the task to run..."></textarea>
    <button onclick="runTask()">Run</button>
    <pre id="taskOutput">{}</pre>
  </div>

  <div class="card">
    <h2>Memory</h2>
    <button onclick="loadMemory()">Load recent memory</button>
    <pre id="memoryOutput">[]</pre>
  </div>

  <script>
    async function loadStatus() {
      const res = await fetch("/api/status");
      const data = await res.json();
      document.getElementById("statusOutput").textContent = JSON.stringify(data, null, 2);
    }

    async function createPlan() {
      const goal = (document.getElementById("planGoal").value || "").trim();
      if (!goal) return;
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal })
      });
      const data = await res.json();
      document.getElementById("planOutput").textContent = JSON.stringify(data, null, 2);
    }

    async function runTask() {
      const goal = (document.getElementById("taskGoal").value || "").trim();
      if (!goal) return;
      const res = await fetch("/api/run-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal })
      });
      const data = await res.json();
      document.getElementById("taskOutput").textContent = JSON.stringify(data, null, 2);
    }

    async function loadMemory() {
      const res = await fetch("/api/memory/query?limit=50");
      const data = await res.json();
      document.getElementById("memoryOutput").textContent = JSON.stringify(data, null, 2);
    }

    loadStatus();
  </script>
</body>
</html>
  `;
  res.send(html);
});

app.listen(env.port, () => {
  console.log(`Genesis Forge listening on port ${env.port}`);
});
