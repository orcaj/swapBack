const User = require('../models')['user']
const Referral = require('../models')['referral'];
const ClaimLog = require('../models')['claimLog']

var Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');


var SmartContractAddress = process.env.SMART_CONTRACT;
var SmartContractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "claim", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "depositBNB", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getReferralCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "_userWalletsArray", "type": "address[]" }, { "internalType": "uint256[]", "name": "_referralAmountArray", "type": "uint256[]" }], "name": "inputInfo", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "referralCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
const privateKey = process.env.PRIMARY_KEY;
const address = process.env.OWNER_ADDRESS
var bscurl = "https://data-seed-prebsc-1-s1.binance.org:8545";
// var bscurl = "https://ropsten.infura.io/v3/59bbb60536324212bcac1e49d10814d8";

const sendData = async (users_wallets, users_amount) => {
    try {
        var provider = new Provider(privateKey, bscurl);
        var web3 = new Web3(provider);
        var myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);

        var result = await myContract.methods.inputInfo(users_wallets, users_amount).send({ from: address });
        return result;
    } catch (error) {
        console.log({ error })
        return false;
    }


}

module.exports = async function () {
    try {
        const users = await User.findAll();
        const users_wallets = [];
        const users_amount = [];
        for (let index = 0; index < users.length; index++) {
            const user = users[index];
            users_wallets.push(user.wallet_address);
            let amount = 0;

            const friends = await Referral.findAll(
                { where: { user_id: user.id } }
            );

            if (friends.length > 0) {
                for (let j = 0; j < friends.length; j++) {
                    const item = friends[j];
                    const guy = await User.findByPk(item.friend_id);
                    amount += guy.spend_recot * 0.04;
                }
            }
            const claimLog = await ClaimLog.findOne({ where: { user_id: user.id } });
            if (claimLog) {
                amount -= claimLog.claim_amount;
            }
            const referAmount = amount * 10 ** 18
            users_amount.push(referAmount.toString());
        }
        // const res = await sendData(users_wallets, users_amount);
        console.log('after deply', users_wallets, users_amount)
    } catch (error) {
        console.error(error);
    }
};
