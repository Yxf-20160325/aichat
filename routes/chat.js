const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { isAuthenticated } = require('../middleware/auth');

// 聊天页面
router.get('/', isAuthenticated, chatController.chatPage);

// 发送消息
router.post('/send', isAuthenticated, chatController.sendMessage);

// 充值页面
router.get('/recharge', isAuthenticated, chatController.rechargePage);

// 充值处理
router.post('/recharge', isAuthenticated, chatController.recharge);

module.exports = router;