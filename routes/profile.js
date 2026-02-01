const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');

// 个人资料页面
router.get('/', isAuthenticated, profileController.profilePage);

// 修改密码
router.post('/change-password', isAuthenticated, profileController.changePassword);

// 修改邮箱
router.post('/change-email', isAuthenticated, profileController.changeEmail);

// 注销账户
router.post('/delete-account', isAuthenticated, profileController.deleteAccount);

module.exports = router;
