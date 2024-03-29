const express = require('express');
const bodyParser = require('body-parser');
const Chat = require('../models/Chat');
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const authenticate = require('../authenticate');
const cors = require('./cors');
const fs=require('fs');
const { response } = require('express');
require('dotenv').config();

const router = express.Router();
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });
function encryptMessage(text) {
    let message = CryptoJS.AES.encrypt(text, process.env.secretKey).toString();
    return message;
}

function decryptMessage(text) {
    let message = CryptoJS.AES.decrypt(text, process.env.secretKey).toString(CryptoJS.enc.Utf8);
    return message;
}

router.get(("/getChat/:receiver"),authenticate.verifyUser,cors.corsWithOptions, (req, res) => {
    //console.log(req.user._id);
    //console.log(req.body);
    Chat.find({
        $or: [
            { $and: [{ sender: req.user._id }, { receiver: req.params.receiver }] },
            { $and: [{ sender: req.params.receiver }, { receiver: req.user._id }] }
        ]
    }, (err, messages) => {
        const chats = {
            chat: []
        };
        //console.log(messages);
        for (let i = 0; i < messages.length; i++) {
            chats.chat.push({
                _id:messages[i]._id,
                sender: messages[i].sender,
                receiver: messages[i].receiver,
                text: decryptMessage(messages[i].message),
                File:messages[i].File,
                data:messages[i].data,
                time: messages[i].createdAt
            });
        }
        //console.log(chats);
        res.statusCode = 200;
        res.json(chats);
        
    })
})

router.post(("/addChat"),authenticate.verifyUser,cors.corsWithOptions, (req, res) => {
    if(req.body.data==0)
    {
        //console.log(req.body.File);
        const encrypt = encryptMessage("Not a Message");
        const chat = new Chat({
            sender: req.user._id,
            receiver: req.body.receiver,
            message:encrypt,
            data:0,
            File:req.body.File
        })
        chat.save();

        res.statusCode = 200;
        res.json({ status: "Saved" });
    }
    else
    {
        //console.log(req.body);
        const encrypt = encryptMessage(req.body.message);
        const chat = new Chat({
            sender: req.user._id,
            receiver: req.body.receiver,
            message: encrypt,
            data:1,
            File:{'filename':'Not a file','title':'No file'}
        })
        chat.save();

        res.statusCode = 200;
        res.json({ status: "Saved" });
    }
})

module.exports = router;