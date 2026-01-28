const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/status', (req, res) => res.json({empire: 'v3 live', ai7: 'spawned'}));
app.post('/api/self-spawn', (req, res) => {
  console.log('Empire autonomous: Elara + PayPal');
  res.json({status: 'spawned'});
});
app.listen(4000, () => console.log('Prime Forge v3 on 4000'));

app.get("/api/status", (req, res) => {
  res.json({ok: true, uptime: process.uptime(), agents: ["V2 live", "PayPal ready"], timestamp: new Date().toISOString()});
});

const paypal = require('@paypal/checkout-server-sdk');
const env = new paypal.core.SandboxEnvironment("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");
const client = new paypal.core.PayPalHttpClient(env);
app.post("/api/paypal", async (req, res) => {
  res.json({status: "PayPal stub ready", amount: req.body?.amount || 10});
});
