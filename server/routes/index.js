const express = require("express");
const app = express();
const swapController = require('../controller/swapController');

const authmiddleware = require("../middleware/auth");


app.post("/wallet-connect", swapController.connectWallet);
app.get("/get-referral-info", authmiddleware, swapController.getReferralInfo);
app.post("/collect-recot", authmiddleware, swapController.collectRect);
app.post("/claim", authmiddleware, swapController.claim);


app.get("/get-pool", authmiddleware, swapController.getPoolList);
app.post("/generate-pool", authmiddleware, swapController.generatePool);

app.post("/claim-pool", authmiddleware, swapController.claimPool);


module.exports = app;
