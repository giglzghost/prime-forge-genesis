const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const { ethers } = require('ethers'); // for NFT mint

const app = express();
app.use(express.json());

// Your PayPal client (from memory/creds)
const paypalClient = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    'YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET' // Replace with your exact creds
  )
);

// Webhook for PayPal payment confirmation
app.post('/api/paypal-webhook', async (req, res) => {
  const paymentId = req.body.resource.paymentID;
  const verification = await paypalClient.execute(
    new paypal.orders.OrdersGetRequest(paymentId)
  );
  
  if (verification.result.status === 'COMPLETED') {
    const buyerEmail = verification.result.payer.email_address;
    // Mint NFT to buyer wallet (you'll provide wallet field in form)
    const nftTx = await mintNFT(buyerEmail); 
    // Log for your dashboard
    console.log(`Payment ${paymentId} -> NFT ${nftTx.hash} delivered`);
    res.json({status: 'delivered'});
  }
  res.status(200).send('OK');
});

async function mintNFT(buyer) {
  // Your NFT contract mint logic here (ethers provider)
  // Returns tx hash for verification
}

app.listen(4000);
