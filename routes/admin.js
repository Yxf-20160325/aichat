const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// 管理员首页
router.get('/', isAuthenticated, isAdmin, adminController.adminHome);

// 用户编辑页面
router.get('/edit/:id', isAuthenticated, isAdmin, adminController.editUserPage);

// 编辑用户
router.post('/edit/:id', isAuthenticated, isAdmin, adminController.editUser);

// 删除用户
router.get('/delete/:id', isAuthenticated, isAdmin, adminController.deleteUser);

// 更改密码页面
router.get('/change-password/:id', isAuthenticated, isAdmin, adminController.changePasswordPage);

// 更改密码
router.post('/change-password/:id', isAuthenticated, isAdmin, adminController.changePassword);

// 封禁用户页面
router.get('/ban/:id', isAuthenticated, isAdmin, adminController.banUserPage);

// 封禁用户
router.post('/ban/:id', isAuthenticated, isAdmin, adminController.banUser);

// 解封用户
router.get('/unban/:id', isAuthenticated, isAdmin, adminController.unbanUser);

// 模型设置页面
router.get('/settings', isAuthenticated, isAdmin, adminController.settingsPage);

// 更新模型设置
router.post('/settings', isAuthenticated, isAdmin, adminController.updateSettings);

module.exports = router;