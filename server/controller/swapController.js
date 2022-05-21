const User = require('../models/')['user']
const Referral = require('../models')['referral']
const ClaimLog = require('../models')['claimLog']
const Pool = require('../models')['pool']
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');

function generateToken(userId, expiredTime) {
    return jwt.sign({ id: userId }, process.env.TOKEN_SECRET);
}

async function connectWallet(req, res) {
    const { wallet_address, friendId } = req.body;
    let user;
    if (!wallet_address) {
        return res.send({ result: false })
    }
    user = await User.findOne({ where: { 'wallet_address': wallet_address } });

    if (!user) {
        user = await User.create({
            wallet_address,
        })
    }

    if (friendId != -1) {
        const existFriend = await Referral.findOne({ where: { user_id: user.id, friend_id: friendId } });
        console.log({ existFriend })
        if (!existFriend) {
            const friend = await Referral.create({
                user_id: friendId,
                friend_id: user.id
            })
        }
    }

    const token = generateToken(user.id, process.env.EXPIRED_LOGIN);

    return res.send({ reuslt: true, token, user });
}

async function getReferralInfo(req, res) {
    const userId = req.user.id;
    const referralLink = process.env.FRONT_URL + '/#/connect/' + userId;

    const friends = await Referral.findAll(
        { where: { user_id: userId } }
    );
    let amount = 0;
    if (friends.length > 0) {
        for (let index = 0; index < friends.length; index++) {
            const item = friends[index];
            const guy = await User.findByPk(item.friend_id);
            amount += guy.spend_recot * 0.04;
        }
    }
    const claimLog = await ClaimLog.findOne({ where: { user_id: userId } });
    if (claimLog) {
        amount -= claimLog.claim_amount;
    }

    return res.send({ result: true, referralLink, amount: amount.toFixed(4) });
}

async function collectRect(req, res) {
    const userId = req.user.id;
    const { recotAmount } = req.body;

    const newRecot = parseFloat(req.user.spend_recot) + parseFloat(recotAmount)

    await User.update(
        { spend_recot: newRecot },
        { where: { id: userId } }
    );

    return res.send({ result: true });
}

async function claim(req, res) {
    const userId = req.user.id;
    const { amount } = req.body;

    let claimAmount = 0;
    const claimLog = await ClaimLog.findOne({ where: { user_id: userId } });
    if (claimLog) {
        claimAmount = claimLog.claim_amount + parseFloat(amount);
        claimLog.claim_amount = claimAmount;
        await claimLog.save();
    } else {
        claimAmount = parseFloat(amount);;
        await ClaimLog.create({
            user_id: userId,
            claim_amount: claimAmount
        });
    }


    return res.send({ result: true });
}

async function generatePool(req, res) {
    const userId = req.user.id;
    const { depositId, worthless_amount, bnb, recot_amount, start_date, end_date } = req.body;
    await Pool.create({
        user_id: userId,
        deposit_id: depositId,
        worthless_amount, bnb, recot_amount, start_date, end_date
    })
    const pools = await Pool.findAll({
        where: { user_id: userId }
    })
    return res.send({ result: true, pools });
}

async function getPoolList(req, res) {
    const userId = req.user.id;
    const pools = await Pool.findAll({
        where: { user_id: userId }
    })
    return res.send({ result: true, pools });
}

async function claimPool(req, res) {
    const userId = req.user.id;
    const { amount, id } = req.body;
    const pool = await Pool.findByPk(id);
    pool.claimed_amount = pools.claimed_amount + amount;
    await pool.save();

    const pools = await Pool.findAll({
        where: { user_id: userId }
    })
    return res.send({ result: true, pools });
}

module.exports = { connectWallet, getReferralInfo, collectRect, claim, generatePool, getPoolList, claimPool };
